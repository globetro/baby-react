var _ = require('lodash');

function createCssLoader(ExtractTextPlugin, isSass) {
  var loaders = [];
  if (!ExtractTextPlugin) {
    loaders.push('style');
  }

  if (isSass) {
    loaders = loaders.concat([
      'css?modules&importLoaders=2&localIdentName=[name]--[local]--[hash:base64:5]&sourceMap',
      'postcss',
      'sass?sourceMap'
    ]);
  } else {
    loaders = loaders.concat([
      'css',
      'postcss'
    ]);
  }

  var config = {
    test: isSass ? /\.scss$/ : /\.css$/
  };

  if (ExtractTextPlugin) {
    config.loader = ExtractTextPlugin.extract(
      'style-loader',
      loaders
    );
  } else {
    config.loaders = loaders;
  }

  return config;
}

var babelConfig = {
  presets: function() {
    return ['es2015', 'react', 'stage-0'];
  },
  plugins: function() {
    // Using require.resolve to fix npm link
    // https://github.com/webpack/webpack/issues/1866
    return [
      require.resolve('babel-plugin-transform-decorators-legacy'),
      [require.resolve('babel-plugin-relative-import'), {rootPathSuffix: 'src'}]
    ];
  }
};

function webpackConfigLoaders(ExtractTextPlugin, opts) {
  opts = _.extend({hotReload: false, inline: false}, opts);

  return [
    webpackConfigLoaders.babel({hotReload: opts.hotReload}),
    webpackConfigLoaders.scss(ExtractTextPlugin),
    webpackConfigLoaders.css(ExtractTextPlugin),
    webpackConfigLoaders.images({inline: opts.inline}),
    webpackConfigLoaders.json()
  ];
}
_.extend(webpackConfigLoaders, {
  babel: function(opts) {
    opts = opts || {};

    var hotReload = opts.hotReload;

    var config = {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        presets: babelConfig.presets(),
        plugins: babelConfig.plugins()
      }
    };

    if (hotReload) {
      config.query.plugins.push([
        'react-transform', {
          'transforms': [
            {
              'transform': 'react-transform-hmr',
              'imports': ['react'],
              'locals': ['module']
            },
            {
              'transform': 'react-transform-catch-errors',
              'imports': ['react', 'redbox-react']
            }
          ]
        }
      ]);
    }

    return config;
  },

  scss: function(ExtractTextPlugin) {
    return createCssLoader(ExtractTextPlugin, true);
  },

  css: function(ExtractTextPlugin) {
    return createCssLoader(ExtractTextPlugin, false);
  },

  images: function(opts) {
    opts = opts || {};

    var inline = opts.inline;

    var config = {
      test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i
    };

    if (inline) {
      config.loader = 'url-loader';
    } else {
      config.loader = 'file-loader';
      config.query = {
        name: '/images/[name]-[hash:5].[ext]'
      };
    }

    return config;
  },

  json: function() {
    return {
      test: /\.json$/,
      loader: 'json'
    };
  }
});

var webpackConfig = {
  loaders: webpackConfigLoaders,
  plugins: {
    providePlugin: function(ProvidePlugin) {
      return new ProvidePlugin({
        'React':     'react',
        'cssModule': 'react-css-modules',
        'Promise':   'bluebird'
      });
    }
  }
};

module.exports = {
  babelConfig: babelConfig,
  webpackConfig: webpackConfig
};