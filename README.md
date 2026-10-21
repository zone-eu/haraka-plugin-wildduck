# WildDuck plugin for Haraka

This plugin:

- enables recipient checks for Haraka. It normalizes recipient email addresses and validates these against the users table in the WildDuck database.
- checks quota usage, so if the user quota has been exceeded, the message is rejected.
- delivers messages to mongodb.

## Install

```sh
cd /path/to/local/haraka
npm install haraka-plugin-wildduck
echo "wildduck" >> config/plugins
service haraka restart
```

WildDuck plugin should be placed last in the plugins file.

### Configuration

This plugin expects both MongoDB and Redis settings to be set. By default, the bundled config uses unauthenticated localhost for both. If you need more specific settings then create your own configuration file:

```sh
cp node_modules/haraka-plugin-wildduck/config/wildduck.yaml config/wildduck.yaml
$EDITOR config/wildduck.yaml
```

To send Apple push notifications for incoming mail, enable `aps.enabled` and set
`aps.topic`, `aps.certPath`, and `aps.keyPath` in `config/wildduck.yaml`. Use the
same topic, APNs certificate, key, and sandbox setting as WildDuck's `imap.aps`
configuration, and connect to the same WildDuck messages database. Certificate
and key paths can be absolute or relative to Haraka's config directory. Restart
Haraka after changing these settings. Clients register for notifications through
WildDuck's IMAP XAPPLEPUSHSERVICE support.

#### S3 attachment storage

To store new attachment payloads in S3, set `attachments.type` to `s3` and add
the same S3 settings used by WildDuck to `config/wildduck.yaml`:

```yaml
attachments:
    type: 's3'
    bucket: 'attachments' # MongoDB attachment catalog/GridFS bucket
    decodeBase64: true
    s3:
        bucket: 'wildduck-attachments' # S3 bucket
        prefix: 'production'
        region: 'us-east-1'
        #endpoint: 'https://s3.example.com' # S3-compatible storage
        #forcePathStyle: true
        #accessKeyId: '...'
        #secretAccessKey: '...'
```

The S3 bucket and a nonempty prefix are required. Keep the prefix stable and
unique for installations sharing a bucket. Credentials use the AWS SDK default
credential chain unless `accessKeyId` and `secretAccessKey` are set; temporary
credentials can also set `sessionToken`. The bundled configuration lists retry,
timeout, and connection pool options.

Messages and attachment metadata remain in MongoDB. Existing GridFS attachments
continue to work, and existing hashes keep their recorded storage backend.
Configure S3 access in Haraka before any process starts writing S3 attachments:
forwarding can read stored attachments, so Haraka needs the S3 settings even
when its own `attachments.type` is `gridstore`. Use an S3-capable WildDuck version
and matching settings in every process that reads or writes these messages.
Restart Haraka after changing storage settings. An S3 upload failure fails the
delivery so the sending server can retry it.

### Notes

This is the only delivery plugin you need to use Haraka with WildDuck. Make sure Haraka has no other delivery plugin(s) enabled.

For antispam, WildDuck supports [Haraka's Rspamd plugin](https://www.npmjs.com/package/haraka-plugin-rspamd). WildDuck uses Rspamd output to route messages marked as spam to the Junk mailbox.

This plugin includes SPF, DKIM, ARC, DMARC, and BIMI processing. You should not enable overlapping Haraka auth plugins such as `spf` or `dkim_verify`.

## License

European Union Public License 1.1 ([details](http://ec.europa.eu/idabc/eupl.html)) or later

> WildDuck plugin for Haraka (`haraka-plugin-wildduck`) is part of the Zone Mail Suite (ZMS). Suite of programs and modules for an efficient, fast and modern email server.
