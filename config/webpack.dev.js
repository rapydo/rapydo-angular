var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  mode: 'development',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    // publicPath: 'http://localhost',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css')
  ],

  devServer: {
    historyApiFallback: true,

    // https://github.com/webpack/webpack-dev-server/issues/1604
    disableHostCheck: true,

    stats: 'minimal',
    host: '0.0.0.0'
  }
});
