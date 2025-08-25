'use strict';

const { arc } = require('mailauth/lib/arc');
const { dmarc } = require('mailauth/lib/dmarc');
const { spf: checkSpf } = require('mailauth/lib/spf');
const { dkimVerify } = require('mailauth/lib/dkim/verify');
const { bimi } = require('mailauth/lib/bimi');
const libmime = require('libmime');
const { parseReceived } = require('mailauth/lib/parse-received');

async function hookMail(plugin, connection, params) {
    const txn = connection?.transaction;

    if (!txn) {
        return;
    }

    // Step 1. SPF

    const from = params[0];
    txn.notes.sender = txn.notes.sender || from?.address();

    let spfResult;

    try {
        const isRemotePrivate = connection.remote.is_private;

        spfResult = await checkSpf({
            resolver: plugin.resolver,
            ip: isRemotePrivate ? undefined : connection.remote.ip, // SMTP client IP (undefined for if remote is private network)
            helo: connection.hello?.host, // EHLO/HELO hostname
            sender: txn.notes.sender, // MAIL FROM address
            mta: connection.local?.host, // MX hostname
            maxResolveCount: plugin.cfg?.auth?.dns?.maxLookups
        });

        if (isRemotePrivate) {
            // given undefined IP as client IP in case client is from remote IP, SPF will default to neutral, replace with softfail and custom message
            spfResult.status.result = 'softfail';
            spfResult.status.comment = 'cannot assess local addresses';
            spfResult.header = `Received-SPF: softfail (cannot assess local addresses) client-ip=${connection.remote.ip};`;
            spfResult.info = `spf=softfail (cannot assess local addresses)`;
        }

        txn.notes.spfResult = spfResult;
    } catch (err) {
        txn.notes.spfResult = { error: err };
        connection.logerror(plugin, err.message);
        return;
    }

    if (spfResult.header) {
        txn.add_leading_header('Received-SPF', spfResult.header.substring(spfResult.header.indexOf(':') + 1).trim());
    }

    if (spfResult.info) {
        connection.auth_results(spfResult.info);
    }
}

async function hookDataPost(stream, plugin, connection) {
    const txn = connection.transaction;

    const queueId = txn.uuid;

    const contentTypeHeaders = txn.header.get_all('Content-Type').map(line => libmime.parseHeaderValue(`${line}`));

    // Step 2. DKIM
    let dkimResult;
    try {
        dkimResult = await dkimVerify(stream, {
            resolver: plugin.resolver,
            sender: txn.notes.sender,
            seal: null,
            minBitLength: plugin.cfg?.auth?.minBitLength
        });
        txn.notes.dkimResult = dkimResult;

        for (const result of dkimResult?.results || []) {
            if (result.info) {
                connection.auth_results(result.info);
            }
        }
    } catch (err) {
        txn.notes.dkimResult = { error: err };
        connection.logerror(plugin, err.message);
    }

    // Step 3. ARC
    let arcResult;
    if (dkimResult?.arc) {
        try {
            arcResult = await arc(dkimResult.arc, {
                resolver: plugin.resolver,
                minBitLength: plugin.cfg?.auth?.minBitLength
            });
            txn.notes.arcResult = arcResult;

            if (arcResult.info) {
                connection.auth_results(arcResult.info);
            }
        } catch (err) {
            txn.notes.arcResult = { error: err };
            connection.logerror(plugin, err.message);
        }
    }

    // Step 4. DMARC
    let dmarcResult;
    const spfResult = txn.notes.spfResult;
    if (dkimResult?.headerFrom) {
        const passingDomains = (dkimResult.results || [])
            .filter(r => r.status.result === 'pass')
            .map(r => ({
                id: r.id,
                domain: r.signingDomain,
                aligned: r.status.aligned,
                underSized: r.status.underSized
            }));

        try {
            dmarcResult = await dmarc({
                resolver: plugin.resolver,
                headerFrom: dkimResult.headerFrom,
                spfDomains: [].concat((spfResult?.status?.result === 'pass' && spfResult?.domain) || []),
                dkimDomains: passingDomains,
                arcResult
            });
            txn.notes.dmarcResult = dmarcResult;

            if (dmarcResult.info) {
                connection.auth_results(dmarcResult.info);
            }
        } catch (err) {
            txn.notes.dmarcResult = { error: err };
            connection.logerror(plugin, err.message);
        }
    }

    // Step 5. BIMI
    let bimiResult;
    if (dmarcResult) {
        try {
            bimiResult = await bimi({
                resolver: plugin.resolver,
                dmarc: dmarcResult,
                headers: dkimResult.headers,

                // require valid DKIM, ignore SPF
                bimiWithAlignedDkim: true
            });
            txn.notes.bimiResult = bimiResult;

            // Remove any existing BIMI headers that may have been present
            txn.remove_header('bimi-location');
            txn.remove_header('bimi-indicator');

            if (bimiResult.rr) {
                txn.add_header('BIMI-Location', libmime.foldLines(bimiResult.rr, 160));
            }
        } catch (err) {
            txn.notes.bimiResult = { error: err };
            connection.logerror(plugin, err.message);
        }
    }

    const receivedChain = dkimResult?.headers?.parsed.filter(r => r.key === 'received').map(row => parseReceived(row.line));
    const receivedChainComment = []
        .concat(receivedChain || [])
        .slice(1)
        .reverse()
        .slice(0, 5)
        .map(entry => entry?.by?.comment)
        .filter(value => value)
        .join(', ');

    for (const result of dkimResult?.results || []) {
        if (result.info) {
            connection.auth_results(result.info);
        }

        const signingHeaders = (result.signingHeaders?.keys || '')
            .toString()
            .split(':')
            .map(e => e.toLowerCase().trim());

        plugin.loggelf({
            short_message: '[DKIM] ' + result.status?.result,
            _queue_id: queueId,
            _mail_action: 'dkim_verify',
            _dkim_envelope_from: dkimResult?.envelopeFrom,
            _dkim_header_from: dkimResult?.headerFrom && [].concat(dkimResult?.headerFrom).join(', '),
            _dkim_info: result.info,
            _dkim_status: result.status?.result,
            _dkim_length_limited: result.canonBodyLengthLimited ? 'yes' : 'no',
            _dkim_over_sized: result.status?.underSized,
            _dkim_aligned: result.status?.aligned,
            _dkim_signing_domain: result.signingDomain,
            _dkim_selector: result.selector,
            _dkim_algo: result.algo,
            _dkim_mod_len: result.modulusLength,
            _dkim_canon_header: result.format?.split('/').shift(),
            _dkim_canon_body: result.format?.split('/').pop(),
            _dkim_body_size_source: result.sourceBodyLength,
            _dkim_body_size_canon: result.canonBodyLengthTotal,
            _dkim_body_size_limit: result.canonBodyLengthLimited && result.canonBodyLengthLimit,
            _dkim_canon_mime_start: result.mimeStructureStart,
            _dkim_signing_headers: signingHeaders.join(','),
            _dkim_signing_headers_content_type: signingHeaders.includes('content-type') ? 'yes' : 'no',
            _spf_status: txn.notes.spfResult?.status?.result,
            _spf_domain: txn.notes.spfResult?.domain,
            _dmarc_status: dmarcResult?.status?.result,
            _dmarc_spf_aligned: dmarcResult?.alignment?.spf?.result,
            _bimi_status: bimiResult?.status?.result,
            _bimi_comment: bimiResult?.status?.comment,
            _bimi_vmc: bimiResult?.status?.result === 'pass' && (bimiResult?.authority ? 'yes' : 'no'),
            _content_type_count: contentTypeHeaders.length,
            _content_type_boundary: contentTypeHeaders.length ? contentTypeHeaders.at(-1)?.params?.boundary?.substr(0, 20) : null,
            _received_by_comment: receivedChainComment
        });
    }

    // BIMI post-check (VMC validation)
    if (txn.notes?.bimiResult?.status?.result === 'pass') {
        const bimiResult = txn.notes.bimiResult;
        let bimiInfo = bimiResult.info || '';

        const bimiResolution = {
            short_message: `[BIMI] ${bimiResult.status?.header?.d}`,
            _queue_id: queueId,
            _bimi_domain: bimiResult.status?.header?.d
        };

        try {
            const bimiData = await plugin.bimiHandler.getInfo(bimiResult);
            if (bimiData?._id) {
                txn.notes.bimi = bimiData?._id;

                bimiResolution._has_bimi = 'yes';
                bimiResolution._bimi_cached_id = bimiData?._id.toString();
                bimiResolution._bimi_type = bimiData?.type;
                bimiResolution._bimi_url = bimiData?.url;
                bimiResolution._bimi_source = bimiData?.source;

                if (bimiData.vmc && bimiData.vmc.logoFile) {
                    const bimiIndicator = bimiData.vmc.logoFile;

                    let wrappedBimiIndicator = bimiIndicator.substring(0, 49); // first 49 chars
                    for (let i = 49; i < bimiIndicator.length; i += 64) {
                        // Wrap 64 chars per line
                        wrappedBimiIndicator += `\r\n ${bimiIndicator.substring(i, i + 64)}`;
                    }

                    txn.add_header('BIMI-Indicator', wrappedBimiIndicator);
                }

                // BIMI has passed all required validations
                bimiInfo = bimiInfo.replace('policy.authority=none', 'policy.authority=pass');
            } else {
                bimiResolution._has_bimi = 'no';
            }
        } catch (err) {
            bimiInfo = bimiInfo.replace('policy.authority=none', 'policy.authority=fail');
            //connection.logerror(plugin, 'Failed to get BIMI logo: ' + err.stack);

            bimiResolution._failure = 'yes';
            bimiResolution._error = err.message;
            bimiResolution._err = err.code;

            bimiResolution._bimi_source = err.source;

            if (err.details && err.details.url) {
                bimiResolution._bimi_url = err.details.url;
                delete err.details.url;
            }

            if (err.details) {
                bimiResolution._bimi_data = JSON.stringify(err.details);
            }
        } finally {
            plugin.loggelf(bimiResolution);
        }

        // Add bimi auth results
        if (bimiInfo) {
            connection.auth_results(bimiInfo);
        }
    }
}

module.exports = { hookDataPost, hookMail };
