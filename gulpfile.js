var nib = require('nib');
var glob = require('glob');
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var rename = require('gulp-rename');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var path = require('path');
var browserify = require('browserify');
var gutil = require('gulp-util');

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

gulp.task('js', bundleWith(browserify, {debug: true}));
gulp.task('js:watch', bundleWith(watchify, {debug: true}));

// Default gulp task to run
gulp.task('default', ['styles', 'styles:watch', 'js:watch']);



function bundleWith(bundlerFn, bundleOpts) {
  return function() {
    return bundle(
      bundlerFn,
      __dirname + '/scripts/all.js',
      __dirname + '/public/bundle.js',
      bundleOpts
    );
  };
}

function bundle(bundlerFn, entries, outFile, bundleOpts) {
  var bundler = bundlerFn({
    entries: entries
  });

  bundler.on('update', rebundle);
  bundler.on('log', gutil.log);

  function rebundle () {
    return bundler.bundle(bundleOpts || {})
      .on('error', function(err) { gutil.log('ERROR: ' + err.message); gutil.beep(); })
      .pipe(source(path.basename(outFile)))
      .pipe(gulp.dest(path.dirname(outFile)));
  }

  return rebundle();
}