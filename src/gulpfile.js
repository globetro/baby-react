var ENV = process.env.ENV || 'dev';

var dev = require('./gulp-tasks/dev');

module.exports = function(gulp) {
  dev(gulp, ENV);
};