var nib = require('nib');
var glob = require('glob');
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');

// Get one .styl file and render
gulp.task('styles', function () {
  return gulp.src('./stylesheets/imports.styl')
    .pipe(stylus({errors: true, linenos: true, use: nib()}))
    .pipe(rename('all.css'))
    .pipe(gulp.dest('./public'));
});

gulp.task('styles:watch', function() {
  var styles = glob('./stylesheets/**/*.styl', {sync: true});

  gulp.watch(styles, ['styles']);
});



// Default gulp task to run
gulp.task('default', ['styles', 'styles:watch']);
