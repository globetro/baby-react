const _                 = require('lodash');
const webpack           = require('webpack');
const webpackBaseConfig = require('./webpack.base.config');
const Config            = require('./config');

module.exports = function(ENV) {
  var defaultConfig = webpackBaseConfig(ENV, {
    outputPath: '/',
    outputFilename: '/[name].js',
    outputPublicPath: `http://localhost:${Config.PORT}/`,
    enableExtractText: false,
    enableHotReload: true,
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  });

  return _.extend({}, defaultConfig, {
    entry: _.mapValues(defaultConfig.entry, (i) => {
      return _.flatten(['webpack-hot-middleware/client?reload=true&timeout=20000', i]);
    }),

    devtool: '#inline-source-map'
  });
};