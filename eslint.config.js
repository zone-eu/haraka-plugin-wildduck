'use strict';

const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([
    {
        extends: compat.extends('nodemailer', 'prettier', '@haraka'),
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script'
        },
        rules: {
            'no-await-in-loop': 0
        }
    }
]);
