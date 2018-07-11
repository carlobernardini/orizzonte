// const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server'
    ],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/'
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        hot: true,
        port: 3000,
        historyApiFallback: true,
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
            loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
        }]
    },
    sassLoader: {
        includePaths: [ 'src/scss' ]
    },
    resolve: {
        alias: {
            'orizzonte': path.resolve(__dirname, '../src')
        },
        modules: [path.resolve(__dirname, '../node_modules')],
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('dev'),
            },
        }),
    ]
};
