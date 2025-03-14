# Changelog

## [5.8.20](https://github.com/zone-eu/haraka-plugin-wildduck/compare/v5.8.19...v5.8.20) (2025-03-12)


### Bug Fixes

* **docker-workflows:** On release do not push duplicate latest ZMS-205 ([#62](https://github.com/zone-eu/haraka-plugin-wildduck/issues/62)) ([eea1465](https://github.com/zone-eu/haraka-plugin-wildduck/commit/eea14658bf33197ff071cf89d69ceff1f65202de))
* **mta-relay:** add support for mtaRelay ZMS-171 ([#56](https://github.com/zone-eu/haraka-plugin-wildduck/issues/56)) ([7aee2df](https://github.com/zone-eu/haraka-plugin-wildduck/commit/7aee2df44e722e48834ba2f9b013768655c9eb66))

## [5.8.19](https://github.com/zone-eu/haraka-plugin-wildduck/compare/v5.8.18...v5.8.19) (2025-03-10)


### Bug Fixes

* **docker-workflows:** ZMS-180-3 ([#59](https://github.com/zone-eu/haraka-plugin-wildduck/issues/59)) ([e31d83c](https://github.com/zone-eu/haraka-plugin-wildduck/commit/e31d83c2a6ef2cb1a057ebdeda5dcde4ef6122e8))
* **docker-workflow:** update docker workflows. Use docker-metadata actions. Remove image attestation ZMS-205 ([#61](https://github.com/zone-eu/haraka-plugin-wildduck/issues/61)) ([f4cff17](https://github.com/zone-eu/haraka-plugin-wildduck/commit/f4cff17732a98b7f40818ef65233c04e37a97728))
* **update-package.json-dockerfile:** Update dockerfile and package.json ZMS-180 ([#57](https://github.com/zone-eu/haraka-plugin-wildduck/issues/57)) ([7e6b193](https://github.com/zone-eu/haraka-plugin-wildduck/commit/7e6b193117b5992d9d8de41f5252278a67abf8f5))
* **workflows-arm/v7-remove:** remove linux/arm/v7 from built images ([#60](https://github.com/zone-eu/haraka-plugin-wildduck/issues/60)) ([e93d1f5](https://github.com/zone-eu/haraka-plugin-wildduck/commit/e93d1f55f55aaafd086fe301875a6c5551651b65))

## [5.8.18](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.17...v5.8.18) (2025-01-30)


### Bug Fixes

* **update-deps:** update wd dep ([#54](https://github.com/nodemailer/haraka-plugin-wildduck/issues/54)) ([e6c3f71](https://github.com/nodemailer/haraka-plugin-wildduck/commit/e6c3f715c1dec2d5372189d21458a35255ab57f1))

## [5.8.17](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.16...v5.8.17) (2025-01-20)


### Bug Fixes

* **catchall-address:** ZMS-184-2 ([#51](https://github.com/nodemailer/haraka-plugin-wildduck/issues/51)) ([7ce263c](https://github.com/nodemailer/haraka-plugin-wildduck/commit/7ce263cd7539c6cb939e54b33cf9edb7283cdc76))

## [5.8.16](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.15...v5.8.16) (2024-12-23)


### Bug Fixes

* **catchall-header:** ZMS-184 ([#49](https://github.com/nodemailer/haraka-plugin-wildduck/issues/49)) ([6ca9d00](https://github.com/nodemailer/haraka-plugin-wildduck/commit/6ca9d009966b860c201e8b0c7c24856263369c3e))

## [5.8.15](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.14...v5.8.15) (2024-11-05)


### Bug Fixes

* **bimi:** Bumped mailauth for BIMI CMC support ([94ad9f4](https://github.com/nodemailer/haraka-plugin-wildduck/commit/94ad9f4414d7ce65ef34f1c5364393e4cefd9840))

## [5.8.14](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.13...v5.8.14) (2024-10-28)


### Bug Fixes

* **cicd-pipeline:** Docker setup release ([#43](https://github.com/nodemailer/haraka-plugin-wildduck/issues/43)) ([691aed5](https://github.com/nodemailer/haraka-plugin-wildduck/commit/691aed559eb40778fdda20956c8cf7b3f9c11d01))
* **deps:** Bumped dependencies ([5472b04](https://github.com/nodemailer/haraka-plugin-wildduck/commit/5472b04dce3a368819dd49ddbfca07df0706db90))
* **license-readme-copyright:** ZMS-180 ([#47](https://github.com/nodemailer/haraka-plugin-wildduck/issues/47)) ([57e68aa](https://github.com/nodemailer/haraka-plugin-wildduck/commit/57e68aacfda4d0281883bcbb2b5da5b3d30100db))
* **log-filecontenthash:** add attachment file content hash logging through graylog ZMS-176 ([#45](https://github.com/nodemailer/haraka-plugin-wildduck/issues/45)) ([1fabcf4](https://github.com/nodemailer/haraka-plugin-wildduck/commit/1fabcf4e4616469a9a9103cb4d087db04b890c5f))
* **log-headerfromvalue:** graylog header from value should be MIME decoded before logging ZMS-138 ([#46](https://github.com/nodemailer/haraka-plugin-wildduck/issues/46)) ([11f71a0](https://github.com/nodemailer/haraka-plugin-wildduck/commit/11f71a05c7532ad7c581232640e73b722bb55563))
* **logs:** Log quota information when account over quota ([b1ba829](https://github.com/nodemailer/haraka-plugin-wildduck/commit/b1ba829cd91ea5d34ae38b29ed1615a30b86b9a8))

## [5.8.13](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.12...v5.8.13) (2024-08-08)


### Bug Fixes

* **auth-spf:** ZMS-165. if remote IP is private default to softfail with custom message ([#42](https://github.com/nodemailer/haraka-plugin-wildduck/issues/42)) ([0198c4f](https://github.com/nodemailer/haraka-plugin-wildduck/commit/0198c4fa6a3518cf2356ea3bf86e0081e93a5540))
* Bumped deps ([21a9934](https://github.com/nodemailer/haraka-plugin-wildduck/commit/21a99345a723b6b441b07dde5c8bb46c0b549ebc))
* **connection-object:** remove_ip -&gt; remove.ip. Otherwise shows undefined ([#40](https://github.com/nodemailer/haraka-plugin-wildduck/issues/40)) ([24a6a20](https://github.com/nodemailer/haraka-plugin-wildduck/commit/24a6a2077d8390de36c40f1f8be46e3a33485e04))

## [5.8.12](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.11...v5.8.12) (2024-04-22)


### Bug Fixes

* **deps:** Bumped WildDuck ([3b496f8](https://github.com/nodemailer/haraka-plugin-wildduck/commit/3b496f8b2ad814b4acdc3670eea6dd775125032a))

## [5.8.11](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.10...v5.8.11) (2024-04-19)


### Bug Fixes

* **eslint:** Lock eslint version to v8 ([6b93f19](https://github.com/nodemailer/haraka-plugin-wildduck/commit/6b93f19a5eb3b189c92170138bf5bc8f6ec1a762))
* init_wildduck_transaction in index, in case hook_mail not run ([#33](https://github.com/nodemailer/haraka-plugin-wildduck/issues/33)) ([30374bd](https://github.com/nodemailer/haraka-plugin-wildduck/commit/30374bd3621f723ee6069eb5f5a6bdfff68c9934))
* **logging:** If DMARC was missing, then logging failed with an error ([830ad7d](https://github.com/nodemailer/haraka-plugin-wildduck/commit/830ad7dfe7c0f38949d90d7a9ca97a3c22f0065d))

## [5.8.10](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.9...v5.8.10) (2024-04-01)


### Bug Fixes

* **deps:** Bumped wildduck from 1.42.1 to 1.42.5 ([a97d048](https://github.com/nodemailer/haraka-plugin-wildduck/commit/a97d048ee240afa219adaf2d58c08c655bf66aeb))

## [5.8.9](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.8...v5.8.9) (2024-02-12)


### Bug Fixes

* **logs:** do not log entire received chain ([102b4b0](https://github.com/nodemailer/haraka-plugin-wildduck/commit/102b4b0268c97c575090db38700e9ad02a03c26a))
* **logs:** Log received chain comments ([#28](https://github.com/nodemailer/haraka-plugin-wildduck/issues/28)) ([3633ed2](https://github.com/nodemailer/haraka-plugin-wildduck/commit/3633ed20548ba1ff91fa1c0c8ac2b23c63d8886e))

## [5.8.8](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.7...v5.8.8) (2024-02-08)


### Bug Fixes

* **logs:** added bimi and dmarc entries for dkim logs to graylog ([dca10a0](https://github.com/nodemailer/haraka-plugin-wildduck/commit/dca10a02b9e765327ee506ca7549b5d5e3911333))

## [5.8.7](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.6...v5.8.7) (2024-02-05)


### Bug Fixes

* **deps:** bumped deps for fixes ([a527c41](https://github.com/nodemailer/haraka-plugin-wildduck/commit/a527c41bf74cdbc2d223d1bfca468094b0db1d76))

## [5.8.6](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.5...v5.8.6) (2024-01-26)


### Bug Fixes

* **deps:** bumped mailauth ([7fc7781](https://github.com/nodemailer/haraka-plugin-wildduck/commit/7fc77814615c6426915778a79b5c366ec9c494a9))

## [5.8.5](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.4...v5.8.5) (2024-01-25)


### Bug Fixes

* **dkim:** Log spf results in dkim signature log rows ([d93ae97](https://github.com/nodemailer/haraka-plugin-wildduck/commit/d93ae973b756271850f837d4897417910834485e))

## [5.8.4](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.3...v5.8.4) (2024-01-25)


### Bug Fixes

* **dkim:** added additional dkim log entries ([bed5a64](https://github.com/nodemailer/haraka-plugin-wildduck/commit/bed5a640b041fe8370afa9dd55e83ae2ed67bee7))

## [5.8.3](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.2...v5.8.3) (2024-01-25)


### Bug Fixes

* **dkim:** Log dkim signatures ([89a0b0b](https://github.com/nodemailer/haraka-plugin-wildduck/commit/89a0b0bbec4cca5a2b12f620d04220d01771915b))
* **mbix_full:** Return a hard bounce for full mailbox ([d596226](https://github.com/nodemailer/haraka-plugin-wildduck/commit/d59622638b5599418ff062d5bd2ace1011c17f02))

## [5.8.2](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.1...v5.8.2) (2023-10-17)


### Bug Fixes

* **deps:** Bumped dependencies ([def43fb](https://github.com/nodemailer/haraka-plugin-wildduck/commit/def43fb9eaee7ac4ab76ccb91f38a33c41693d4f))

## [5.8.1](https://github.com/nodemailer/haraka-plugin-wildduck/compare/v5.8.0...v5.8.1) (2023-09-05)


### Bug Fixes

* **ci:** Added CI test runner and release builder ([d575511](https://github.com/nodemailer/haraka-plugin-wildduck/commit/d5755118a904a35d2737c63b2780cb5151f55a22))
* **release:** added package-lock required for publishing ([12e2af8](https://github.com/nodemailer/haraka-plugin-wildduck/commit/12e2af890d3072e175b47e230241114a57487ea7))
