const path = require('path');
const autoprefixer = require('autoprefixer');
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

/**
 * Extend the current storybook webpack config to resolve the library components path
 */

module.exports = (baseConfig, env) => {
    const config = genDefaultConfig(baseConfig, env);
    config.resolve.alias.orizzonte = path.resolve(__dirname, '../src');
    config.module.rules.push({
        test: /\.(s*)css$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [autoprefixer()]
                }
            },
            'sass-loader',
        ],
        include: path.resolve(__dirname, '../')
    });
    return config;
};
