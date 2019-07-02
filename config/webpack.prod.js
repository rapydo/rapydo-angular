const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AotPlugin = require('@ngtools/webpack').AngularCompilerPlugin;

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  // devtool: 'source-map',

  mode: 'production',

  output: {
    // path: helpers.root('dist'),
    path: '/modules/dist',
    publicPath: process.env.FRONTEND_PREFIX,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js'
  },

  module: {
    rules: [
    /*
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          } , 'angular2-template-loader'
        ]
      }
    */
      {
        test: /\.ts$/,
        loaders: [
        {
          loader: '@ngtools/webpack',
          options {
            tsConfigPath: helpers.root('src', 'tsconfig.json'),
          }
        }
        ]
      }
    ]
  },

  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ],
  },

  plugins: [
    
    new AotPlugin({
        tsConfigPath: helpers.root('src', 'tsconfig.json'),
        entryModule: '/rapydo/src/app/app.module#AppModule',
        sourceMap: true
    }),
    
    /*
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    */
    new CompressionPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].[hash].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ]
});

