var path                 = require('path');
var gutil                = require('gulp-util');
var express              = require('express');
var webpack              = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var Dashboard            = require('webpack-dashboard');
var DashboardPlugin      = require('webpack-dashboard/plugin');
var Config               = require('../config');

module.exports = function(gulp, ENV) {
  var WEBPACK_DEV_CONFIG = require('../webpack.dev.config.js')(ENV);
  var DEV_PORT = Config.PORT;
  var compiler = webpack(WEBPACK_DEV_CONFIG);

  gulp.task('dev', () => {
    var dashboard = new Dashboard();
    compiler.apply(new DashboardPlugin(dashboard.setData));

    var app = express();

    app.use(webpackDevMiddleware(compiler, {
      publicPath: WEBPACK_DEV_CONFIG.output.publicPath,
      noInfo: true,
      quiet: true
    }));
    app.use(webpackHotMiddleware(compiler, {
      log: () => {}
    }));

    app.use(express.static('public'));
    app.use(express.static('src'));
    app.use(express.static('src/assets'));

    app.get('*', (req, res, next) => {
      var filename = path.join(compiler.outputPath, 'index.html');
      compiler.outputFileSystem.readFile(filename, (e, content) => {
        if (e) {
          return next(e);
        }
        res.set('content-type', 'text/html');
        res.send(content);
      });
    });

    app.listen(DEV_PORT, 'localhost', e => {
      if (e) {
        throw new gutil.PluginError('serve', e);
      }

      gutil.log('[serve]', `listening on port ${DEV_PORT}`);
    });
  });
};