var webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],

  devServer: {
    historyApiFallback: true,

    // https://github.com/webpack/webpack-dev-server/issues/1604
    disableHostCheck: true,

    stats: 'minimal',
    host: '0.0.0.0'
  }
});
