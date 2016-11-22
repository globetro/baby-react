var _                     = require('lodash');
var path                  = require('path');
var webpack               = require('webpack');
var autoprefixer          = require('autoprefixer');
var ExtractTextPlugin     = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin     = require('html-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var ALL_CONFIG            = require(path.join(process.cwd(), 'config.json'));
var execSync              = require('child_process').execSync;
var webpackConfig         = require('./config-helper').webpackConfig;

module.exports = function(ENV, opts) {
  opts = _.extend({
    outputPath: null,
    outputFilename: null,
    enableCommonChunks: true,
    enableExtractText: true,
    enableHotReload: false,
    plugins: []
  }, opts);

  var CONFIG = ALL_CONFIG[ENV];
  var VERSION;
  try {
    VERSION = execSync('git describe --tag --always').toString().trim();
  } catch (e) {
    VERSION = 'dev';
  }

  return {
    entry: {
      app: './src/app/index.jsx',
      vendor: ['bluebird', 'babel-polyfill', 'react', 'react-css-modules', 'react-dom']
    },
    output: {
      path: opts.outputPath,
      filename: opts.outputFilename,
      chunkFilename: '/js/[chunkhash:5].js',
      publicPath: opts.outputPublicPath !== undefined
                  ? opts.outputPublicPath
                  : CONFIG.cdnHost ? CONFIG.cdnHost + '/' : null
    },
    devtool: '#source-map',
    module: {
      loaders: webpackConfig.loaders(opts.enableExtractText ? ExtractTextPlugin : null, {
        hotReload: opts.enableHotReload,
        inline: opts.enableHotReload
      })
    },
    resolve: {
      root: [path.resolve('./src/app'), path.resolve('./src/assets')],
      extensions: ['', '.js', '.jsx', '.json']
    },
    postcss: function() {
      return [autoprefixer];
    },
    plugins: _.compact([
      new webpack.optimize.OccurenceOrderPlugin(true),
      new webpack.DefinePlugin({
        __CONFIG: JSON.stringify(CONFIG),
        ENV: JSON.stringify(ENV),
        VERSION: JSON.stringify(VERSION)
      }),
      opts.enableCommonChunks
      ?
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      })
      :
      null,
      webpackConfig.plugins.providePlugin(webpack.ProvidePlugin),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html',
        inject: true,
        chunksSortMode: 'dependency'
      }),
      new WebpackNotifierPlugin()
    ].concat(opts.plugins))
  };
};