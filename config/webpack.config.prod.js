const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const LIBRARY_NAME = 'orizzonte';

module.exports = {
    entry: [
        path.resolve(__dirname, '../src/index.js')
    ],
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        library: LIBRARY_NAME,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        filename: `${ LIBRARY_NAME }.min.js`,
    },
    resolve: {
        modules: [
            path.resolve(__dirname, '../node_modules')
        ],
        extensions: ['.js', '.jsx'],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    warnings: false,
                    mangle: true,
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            })
        ]
    },
    module: {
        rules: [{
            test: /(\.js|\.jsx)$/,
            enforce: 'pre',
            exclude: /node_modules/,
            use: ['eslint-loader'],
        }, {
            test: /(\.js|\.jsx)$/,
            use: ['babel-loader'],
            exclude: /node_modules/,
        }, {
            test: /\.(s*)css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer()]
                    }
                }, 'sass-loader']
            })
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            test: /\.(s*)css$/,
            options: {
                sassLoader: {
                    includePaths: [path.resolve(__dirname, '../src/scss')]
                }
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin({
            filename: `${ LIBRARY_NAME }.min.css`
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HashedModuleIdsPlugin()
    ]
};
