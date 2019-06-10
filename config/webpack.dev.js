var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {

  devtool: 'eval-source-map',

  mode: 'development',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    // publicPath: 'http://localhost',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          } , 'angular2-template-loader'
        ]
      }
    ]
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
