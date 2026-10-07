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

For Apple Mail push notifications on incoming messages, use a WildDuck build with XAPPLEPUSHSERVICE and APNs support. Enable `imap.aps.enabled` in `wildduck.yaml` and set `topic`, `certPath`, `keyPath`, and `sandbox` to match WildDuck's `[aps]` settings in `imap.toml`. Certificate and key paths may be absolute or relative to Haraka's configuration directory. Restart Haraka after changing these settings.
### S3 attachment storage

WildDuck 1.52.0 adds S3 storage for deduplicated message attachment payloads. This plugin passes its `attachments` configuration directly to WildDuck. To store new attachment hashes in S3, configure Haraka's `config/wildduck.yaml` with the same S3 settings as WildDuck:

```yaml
attachments:
    type: 's3'
    bucket: 'attachments' # MongoDB catalog / GridFS bucket, not the S3 bucket
    decodeBase64: true
    s3:
        bucket: 'wildduck-attachments'
        prefix: 'production'
        region: 'us-east-1'
        # endpoint: 'https://s3.example.com'
        # forcePathStyle: true
        # accessKeyId: '...'
        # secretAccessKey: '...'
```

The S3 bucket and a nonempty prefix are required. Use a stable prefix unique to the installation within the bucket. Credentials use the AWS SDK default provider chain unless `accessKeyId` and `secretAccessKey` are supplied; `sessionToken` is also supported. The bundled configuration lists timeout and connection options.

MongoDB and Redis are still required. Keep `mongo.gridfs` and `attachments.bucket` aligned with WildDuck because attachment metadata and reference counts remain in MongoDB. Existing GridFS attachments remain readable and are reused; changing `type` affects only new attachment hashes. S3 upload failures defer SMTP delivery for retry.

Upgrade every process that reads or writes message attachments to WildDuck 1.52.0 or later before enabling S3, including Haraka and `zonemta-wildduck`. Haraka also reads stored attachments when forwarding messages, so configure `attachments.s3` whenever S3-backed attachments exist, even if `attachments.type` remains `gridstore`. Restart Haraka after changing storage settings so its message handler is recreated.

### Notes

This is the only delivery plugin you need to use Haraka with WildDuck. Make sure Haraka has no other delivery plugin(s) enabled.

For antispam, WildDuck supports [Haraka's Rspamd plugin](https://www.npmjs.com/package/haraka-plugin-rspamd). WildDuck uses Rspamd output to route messages marked as spam to the Junk mailbox.

This plugin includes SPF, DKIM, ARC, DMARC, and BIMI processing. You should not enable overlapping Haraka auth plugins such as `spf` or `dkim_verify`.

## License

European Union Public License 1.1 ([details](http://ec.europa.eu/idabc/eupl.html)) or later

> WildDuck plugin for Haraka (`haraka-plugin-wildduck`) is part of the Zone Mail Suite (ZMS). Suite of programs and modules for an efficient, fast and modern email server.
