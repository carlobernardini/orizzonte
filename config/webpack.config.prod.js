const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sassLoader = require('sass-loader');

const LIBRARY_NAME = 'orizzonte';

module.exports = {
    entry: [
        path.resolve(__dirname, '../src/index.js')
    ],
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
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer()]
                    }
                },'sass-loader']
            })
        }]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            test: /\.(s*)css$/,
            options: {
                sassLoader: {
                    includePaths: [path.resolve(__dirname, "../src/scss")]
                }
            }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new ExtractTextPlugin({
            filename: `${ LIBRARY_NAME }.min.css`
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                warnings: false,
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            },
            output: {
                comments: false,
            },
        }),
    ]
};
