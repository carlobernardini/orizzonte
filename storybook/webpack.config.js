const path = require('path');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

/**
 * Extend the current storybook webpack config to resolve the library components path
 */

module.exports = (baseConfig, env) => {
    const config = genDefaultConfig(baseConfig, env);
    config.resolve.alias['orizzonte'] = path.resolve(__dirname, '../src');
    return config;
};
