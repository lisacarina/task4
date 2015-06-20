/*
 * Hauer, 2015-06-20 
 */
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    del = require('del');
    changed = require('gulp-changed');
    minifyHTML = require('gulp-minify-html');



gulp.task('styles_sass', function() {
  gulp.src('sources/sass/style.scss')
 	.pipe(plumber())
 	.pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('public/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('public/css'))
    .pipe(notify({ message: 'Styles compiled' }));
});

gulp.task('styles', function() {
     gulp.src('sources/css/*.css')
        .pipe(plumber())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'))
        .pipe(notify({ message: 'Styles compiled' }));
});

gulp.task('scripts_vendor', function() {
    gulp.src(['sources/js/vendor/jquery-1.11.2.min.js', 'sources/js/vendor/bootstrap.min.js', 'sources/js/vendor/jquery.unveil.js'])
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(notify({ message: 'Scripts_Vendor compiled' }));
});

gulp.task('scripts', function() {    
  gulp.src('sources/js/*.js')
 	.pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('script.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(notify({ message: 'Scripts compiled' }));
});


gulp.task('clean', function(cb) {
    del(['public/css', 'public/js'], cb);
});

gulp.task('htmlpage', function() {
    var htmlSrc = './sources/*.html',
        htmlDst = './public';

    gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(minifyHTML())
        .pipe(gulp.dest(htmlDst));
});


gulp.task('default', ['clean', 'styles_sass', 'styles', 'scripts_vendor', 'scripts', 'htmlpage'], function() {
    // watch for HTML changes
    gulp.watch('./sources/*.html', function() {
        gulp.run('htmlpage');
    });

// watch for JS changes
    gulp.watch('./sources/scripts/*.js', function() {
        gulp.run('jshint', 'scripts');
    });

// watch for CSS changes
    gulp.watch('./sources/styles/*.css', function() {
        gulp.run('styles');
    });
});