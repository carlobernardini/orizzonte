const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

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
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [autoprefixer()]
                }
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    sassLoader: {
        includePaths: [ 'src/scss' ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {},
                context: __dirname,
            },
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
