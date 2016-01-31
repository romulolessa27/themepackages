// PLEASE SET THIS //
var ThemeDir = 'content/themes/IslandMagic/';

// Modules //
var gulp = require('gulp');
var browserSync = require('browser-sync');
var mamp = require('gulp-mamp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var compass = require('gulp-compass');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var path = require('path');

// Variables //
var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    sassStyle;

// Variables //
env = 'development';

if (env==='development') {
    outputDir = ThemeDir;
    sassStyle = 'expanded';
} else {
    outputDir = ThemeDir;
    sassStyle = 'compressed';
}

//Convert JS and Compress it
jsSources = [
ThemeDir + 'js/jquery-backup.js',
ThemeDir + 'js/tab.js',
ThemeDir + 'js/jquery.magnific-popup.min.js',
ThemeDir + 'js/polyfill.object-fit.min.js',
ThemeDir + 'js/jquery.matchHeight-min.js',
ThemeDir + 'js/jqloader.js',
ThemeDir + 'js/TweenMax.min.js',
ThemeDir + 'js/jquery.scrollmagic.min.js',
ThemeDir + 'js/scripts.js'
];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('scriptcombined.js'))
    .pipe(browserify())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    gulp.watch(ThemeDir + 'js/scriptcomb.js').on('change', browserSync.reload)
});

//Convert SCSS to CSS
sassSources = [ThemeDir + 'sass/style.scss'];

gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: ThemeDir + 'sass',
      css: outputDir,
      image: outputDir,
      style: sassStyle,
      require: ['susy', 'breakpoint']
    })
    .on('error', gutil.log))
//    .pipe(gulp.dest( outputDir + 'css'))
    gulp.watch(ThemeDir + 'sass/style.scss').on('change', browserSync.stream)

});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch([ThemeDir + '/sass/*.scss', ThemeDir + '/sass/*/*.scss'], ['compass']);
});

// Start Server & Live Reload - You Need to Replace the Theme Directory Here//

var options = {};

gulp.task('start', function(cb){
    mamp(options, 'start', cb);
});

gulp.task('stop', function(cb){
    mamp(options, 'stop', cb);
});

gulp.task('mamp', ['start']);

gulp.task('browser-sync', function() {
    browserSync.init([ThemeDir + "*.css", ThemeDir + "*.php"], {
        proxy: 'localhost:8888'
    });
});

gulp.task('default', ['mamp', 'watch', 'js', 'compass', 'browser-sync']);
