#! /usr/bin/env node
var gulp = require('gulp');
require('baby-react/src/gulpfile')(gulp);

var taskName = process.argv[2];
if (!taskName) {
  console.log('Must specify a task to run');
  process.exit(1);
}

if (gulp.tasks[taskName]) { 
  gulp.start(taskName);
}
else {
  console.log('Unknown task: ' + taskName);
  process.exit(1);
}