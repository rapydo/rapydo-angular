var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPublic = require('copy-webpack-plugin');
var helpers = require('./helpers');

var backendURI = ""

var hybridApp = process.env.ANGULARJS != 'disabled'

if (!hybridApp) {
  console.log("hybridApp is DISABLED!")
} else {
  console.log("hybridApp is ENABLED!")
}

if (process.env.APP_MODE == "production") {
  backendURI += "https://";
  backendURI += process.env.BACKEND_HOST;
} else if (process.env.APP_MODE == "debug" || process.env.APP_MODE == "development") {
  backendURI += "http://";
  backendURI += process.env.BACKEND_HOST;
  backendURI += ":";
  backendURI += process.env.BACKEND_PORT;

  
} else {
  console.log("Unknown APP MODE: " + process.env.APP_MODE)
}

var projectTitle = process.env.PROJECT_TITLE;

var entries = {
  'polyfills': './src/polyfills.ts',
  'vendor': './src/vendor.ts',
  'app': './src/main.ts',
  'custom': '/app/frontend/custom.ts'
}

if (hybridApp) {
  entries['angularjs'] = './src/angularjs.ts';
}

var chunks = []
chunks.push('app');
chunks.push('custom');
chunks.push('vendor');
if (hybridApp) {
  chunks.push('angularjs');
}
chunks.push('polyfills');

module.exports = {
  entry: entries,
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

    new webpack.optimize.CommonsChunkPlugin({name: chunks}),

    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'apiUrl': JSON.stringify(backendURI + '/api'),
        'authApiUrl': JSON.stringify(backendURI + '/auth'),
        'templateDir': JSON.stringify('/static/commons/templates/'),
        'blueprintTemplateDir': JSON.stringify('/static/custom/templates/'),
        'projectTitle': JSON.stringify(projectTitle),
        'allowRegistration': JSON.stringify(false),
        'hybridApp': JSON.stringify(hybridApp),
        'loggedLandingPage': JSON.stringify('logged.search')
      }
    }),

    new CopyWebpackPublic(
      [
        { from: '/app/frontend/templates', to: 'static/custom/templates/'},
        { from: '/app/frontend/css', to: 'static/custom/css/'},
        { from: '/app/frontend/js', to: 'static/custom/js/'},
        { from: '/app/frontend/assets', to: 'static/assets/'},

        { from: '/rapydo/src/templates', to: 'static/commons/templates/'},
        { from: '/rapydo/src/css', to: 'static/commons/css/'},

        { from: '/rapydo/src/fonts', to: 'static/fonts/'}
      ]
    )
  ]
};

