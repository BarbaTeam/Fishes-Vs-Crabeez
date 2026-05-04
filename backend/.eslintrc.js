module.exports = {
    extends: 'airbnb-base',
    env: {
        jest: true,
        node: true,
    },
    rules: {
        'max-len': ['error', 200, { 'ignoreStrings': true }],
        'no-underscore-dangle': ['error', { 'allow': ['_id'] }],
        'semi': ['error', 'never'],
    }
};
