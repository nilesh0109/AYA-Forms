var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    package = require('./package.json'),
    fileinclude = require('gulp-file-include'),
    filter = require('gulp-filter');

var banner = [
    '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.title %>\n' +
    ' * <%= package.url %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
].join('');

gulp.task('css', ['copyCSS'], function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('copyCSS', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('app/assets/css'));
});

gulp.task('copyJS', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('app/assets/js'));
});

gulp.task('js', ['copyJS'], function() {
    gulp.src('src/js/scripts.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(header(banner, {
            package: package
        }))
        .pipe(gulp.dest('app/assets/js'))
        .pipe(uglify())
        .pipe(header(banner, {
            package: package
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('app/assets/js'))
        .pipe(browserSync.reload({
            stream: true,
            once: true
        }));
});

gulp.task('fileinclude', function() {
    gulp.src(['src/pages/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('app/'));
});

gulp.task('copyPlugins', function() {
    gulp.src(['src/plugins/**/*.*'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('app/assets/plugins/'));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});
gulp.task('bs-reload', function() {
    browserSync.reload();
});

gulp.task('default', ['fileinclude', 'css', 'js', 'browser-sync','copyPlugins'], function() {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
    gulp.watch("src/**/*.html", ['fileinclude']);
});