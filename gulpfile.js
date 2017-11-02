'use strict';
 
var gulp = require('gulp');
var less = require('gulp-less');
 

var paths = {
  less: ['./app/less/**/*.less']
};

gulp.task('default', ['less', 'watch']);


gulp.task('less', function(done) {
  gulp.src('./app/less/style.less')
    .pipe(less({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./app/css/'))
    .on('end', done);
});
gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
});