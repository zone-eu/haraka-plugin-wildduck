'use strict';

const mongodb = require('mongodb');
const path = require('path');
const Redis = require('ioredis');
const MongoClient = mongodb.MongoClient;
const UserHandler = require('@zone-eu/wildduck/lib/user-handler');
const MessageHandler = require('@zone-eu/wildduck/lib/message-handler');
const { SettingsHandler } = require('@zone-eu/wildduck/lib/settings-handler');
const counters = require('@zone-eu/wildduck/lib/counters');
const tools = require('@zone-eu/wildduck/lib/tools');

const getDBConnection = (main, config, callback) => {
    if (main) {
        if (!config) {
            return callback(null, false);
        }
        if (config && !/[:/]/.test(config)) {
            return callback(null, main.db(config));
        }
    }

    MongoClient.connect(
        config,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err, db) => {
            if (err) {
                return callback(err);
            }
            if (main && db.s && db.s.options && db.s.options.dbName) {
                db = db.db(db.s.options.dbName);
            }
            return callback(null, db);
        }
    );
};

module.exports.connect = (redis, config, callback, options = {}) => {
    const response = {};
    // main connection
    getDBConnection(false, config.mongo.url, (err, db) => {
        if (err) {
            return callback(err);
        }

        if (db.s && db.s.options && db.s.options.dbName) {
            response.database = db.db(db.s.options.dbName);
        } else {
            response.database = db;
        }

        getDBConnection(db, config.mongo.gridfs, (err, gdb) => {
            if (err) {
                return callback(err);
            }
            response.gridfs = gdb || response.database;

            getDBConnection(db, config.mongo.users, (err, udb) => {
                if (err) {
                    return callback(err);
                }
                response.users = udb || response.database;

                getDBConnection(db, config.mongo.sender, (err, sdb) => {
                    if (err) {
                        return callback(err);
                    }
                    response.senderDb = sdb || response.database;

                    response.redis = new Redis(tools.redisConfig(config.redis));

                    let apn = null;
                    const aps = config.imap && config.imap.aps;
                    if (aps && aps.enabled) {
                        try {
                            // Load only when enabled to support WildDuck builds without APNs.
                            // eslint-disable-next-line global-require
                            const ApnClient = require('@zone-eu/wildduck/lib/apn-client');
                            const configDirectory = options.configDirectory || path.join(process.env.HARAKA || process.cwd(), 'config');
                            apn = ApnClient.get({
                                config: {
                                    ...aps,
                                    // WildDuck config loading is disabled; resolve Haraka paths here.
                                    certPath: aps.certPath && path.resolve(configDirectory, aps.certPath),
                                    keyPath: aps.keyPath && path.resolve(configDirectory, aps.keyPath)
                                },
                                database: response.database,
                                loggelf: options.loggelf
                            });
                        } catch (err) {
                            return callback(err);
                        }
                    }

                    response.messageHandler = new MessageHandler({
                        database: response.database,
                        users: response.users,
                        redis: response.redis,
                        gridfs: response.gridfs,
                        attachments: config.attachments,
                        apn,
                        loggelf: options.loggelf
                    });

                    response.userHandler = new UserHandler({
                        database: response.database,
                        users: response.users,
                        redis: response.redis,
                        gridfs: response.gridfs
                    });

                    response.settingsHandler = new SettingsHandler({ db: response.database });

                    response.ttlcounter = counters(response.redis).ttlcounter;

                    return callback(null, response);
                });
            });
        });
    });
};
