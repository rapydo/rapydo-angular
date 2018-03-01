var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPublic = require('copy-webpack-plugin');
var helpers = require('./helpers');

var backendURI = ""

if (process.env.APP_MODE == "production") {
  backendURI += "https://";
  backendURI += process.env.BACKEND_HOST;
} else {
  backendURI += "http://";
  backendURI += process.env.BACKEND_HOST;
  backendURI += ":";
  backendURI += process.env.BACKEND_PORT;
}

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts',
    'rapydo': './src/angularjs.ts',
    'custom': '/app/frontend/custom.ts'
  },
/*
  devServer: {
    publicPath: '/app/frontend'
  },
*/

/*
  output: {
    publicPath: '/app/'
  },
*/

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
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          } , 'angular2-template-loader'
        ]
      },
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
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw-loader'
      }
    ]
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'custom', 'rapydo', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'apiUrl': JSON.stringify(backendURI + '/api'),
        'authApiUrl': JSON.stringify(backendURI + '/auth'),
        'templateDir': JSON.stringify('/static/commons/templates/'),
        'blueprintTemplateDir': JSON.stringify('/static/custom/templates/'),
        'allowRegistration': JSON.stringify(false),
        'loggedLandingPage': JSON.stringify('logged.search')
      }
    }),

    new CopyWebpackPublic(
      [
        { from: '/app/frontend/templates', to: 'static/custom/templates/'},
        { from: '/app/frontend/css', to: 'static/custom/css/'},
        { from: '/app/frontend/assets', to: 'static/assets/'},

        { from: '/rapydo/src/templates', to: 'static/commons/templates/'},
        { from: '/rapydo/src/css', to: 'static/commons/css/'},

        { from: '/rapydo/src/fonts', to: 'static/fonts/'}
      ]
    )
  ]
};

