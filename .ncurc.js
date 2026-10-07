module.exports = {
    upgrade: true,
    reject: [
        // mongodb 5.x driver does not support callbacks, only promises
        'mongodb',

        // some api changes, need to address in the future
        'eslint', 'grunt-eslint',

        // 3.x needs eslint 10, held back above
        '@haraka/eslint-config',

        // new major, held back in WildDuck as well
        'ioredis'
    ]
};
