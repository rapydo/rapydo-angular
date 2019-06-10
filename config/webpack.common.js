var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPublic = require('copy-webpack-plugin');
var helpers = require('./helpers');

var backendURI = "";

if (process.env.BACKEND_URI !== undefined && process.env.BACKEND_URI !== null && process.env.BACKEND_URI !== '') {
  backendURI = process.env.BACKEND_URI;
} else {

  if (process.env.APP_MODE === 'production') {
    backendURI += "https://";
  } else if (process.env.APP_MODE === 'debug' || process.env.APP_MODE === 'development') {
    backendURI += "http://";
  } else {
    console.log("Unknown APP MODE: " + process.env.APP_MODE);
    backendURI += "http://";
  }

  backendURI += process.env.BACKEND_HOST;
  backendURI += ":";
  backendURI += process.env.BACKEND_PORT;

  backendURI += process.env.BACKEND_PREFIX;

}

var projectTitle = process.env.PROJECT_TITLE;

var allowRegistration = process.env.ALLOW_REGISTRATION === 'true';
var allowPasswordReset = process.env.ALLOW_PASSWORD_RESET === 'true';

var processEnv = {
  'apiUrl': JSON.stringify(backendURI + '/api'),
  'authApiUrl': JSON.stringify(backendURI + '/auth'),
  'projectTitle': JSON.stringify(projectTitle),
  'allowRegistration': JSON.stringify(allowRegistration),
  'allowPasswordReset': JSON.stringify(allowPasswordReset),
}

let INJECT_KEY = 'INJECT_'
for (let key in process.env) {
  if (key.startsWith(INJECT_KEY)) {
    processEnv[key.substr(INJECT_KEY.length)] = JSON.stringify(process.env[key])
  }
}

module.exports = {
  entry: {
    'polyfills': '/rapydo/src/polyfills.ts',
    'vendor': '/rapydo/src/vendor.ts',
    'custom': '/app/frontend/custom.ts',
    'main': '/rapydo/src/main.ts'
  },

  // all vendors in a single package
  /*
  optimization: {
      splitChunks: {
          chunks: "all"
      }
  },
  */
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ["/modules/node_modules"]
  },

  resolveLoader: {
    modules: ["/modules/node_modules"]
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        exclude: [helpers.root('src', 'app'), '/app/frontend/app/'],
        loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?sourceMap' })
      },
      {
        test: /\.js$/,
        include: [helpers.root('src', 'app'), '/app/frontend/'],
        loader: 'script-loader'
      },
      {
        test: /\.css$/,
        include: [helpers.root('src', 'app'), '/app/frontend/app/'],
        loader: 'raw-loader'
      }
    ]
  },

  node: {
    // prevent webpack from injecting eval / new Function through global polyfill
    global: false
  },

  plugins: [
    // so that file hashes don't change unexpectedly
    new webpack.HashedModuleIdsPlugin(),
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('/rapydo/src'), // location of your src
      {} // a map of your routes
    ),

    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),

    new HtmlWebpackPlugin({
      template: '/rapydo/src/index.html',
      inject: true,
      sourceMap: true,
      chunksSortMode: 'dependency'
    }),

    new webpack.DefinePlugin({
      'process.env': processEnv
    }),

    new CopyWebpackPublic(
      [
        { from: '/app/frontend/css', to: 'static/custom/css/'},
        { from: '/app/frontend/assets', to: 'static/assets/'},
        { from: '/rapydo/src/css', to: 'static/commons/css/'}
      ]
    )

  ]

};

