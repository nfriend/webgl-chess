const gulp = require('gulp');
const webpack = require('webpack')
const webpackStream = require('webpack-stream');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const del = require('del');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const karma = require('karma');
const path = require('path');
const gulpUtil = require('gulp-util');
const merge2 = require('merge2');

var minify = false;
var dest = './build/';

gulp.task('clean', () => {
    return del(['./build/**/*', './dist/**/*']);
});

gulp.task('scripts', () => {

    const webpackConf = require('./webpack.config.js');

    if (minify) {
        webpackConf.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
    }

    const tsStream = gulp.src(['./app/**/*.ts'])
        .pipe(webpackStream(webpackConf).on('error', function handleError() { this.emit('end'); }))
        .pipe(rename('webgl-chess.js'))
        .pipe(gulp.dest(dest));

    const stockfishStream = gulp.src('./app/stockfish/stockfish.js')
        .pipe(gulp.dest(dest));

    return merge2(tsStream, stockfishStream);
});

gulp.task('scripts:watch', () => {
    return gulp.watch(['./app/**/*.ts', './app/**/*.html'], ['build']);
});

gulp.task('styles', () => {

    const sassOptions = minify ? { outputStyle: 'compressed' } : {};

    return gulp.src('./app/**/*.scss')
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(concat('webgl-chess.css'))
        .pipe(gulp.dest(dest));
});

gulp.task('styles:watch', () => {
    return gulp.watch('./app/**/*.scss', ['styles'])
});

gulp.task('index.html', () => {
    return gulp.src('./app/index.html')
        .pipe(gulp.dest(dest));
});

gulp.task('index.html:watch', () => {
    return gulp.watch('./app/index.html', ['index.html'])
});

gulp.task('assets', () => {
    return gulp.src('./app/assets/**/*')
        .pipe(gulp.dest(path.join(dest, 'assets/')));
});

gulp.task('test', done => {
    startKarmaServer(done, true);
});

gulp.task('test:watch', done => {
    startKarmaServer(done, false);
});

function startKarmaServer(done, singleRun) {
    new karma.Server({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: singleRun
    }, (exitCode) => { 
        if (exitCode !== 0) {
            gulpUtil.log('Karma exited with code ' + gulpUtil.colors.red(exitCode + ''));
        }
        done(); 
    }).start();
}

gulp.task('build', done => {
    runSequence(
        ['clean'],
        ['scripts', 'styles', 'index.html', 'assets'],
        done
    );
});

gulp.task('build:watch', done => {
    runSequence(
        ['build'],
        ['scripts:watch', 'styles:watch', 'index.html:watch'],
        done
    );
});

gulp.task('dist', done => {

    minify = true;
    dest = './dist/'

    runSequence(
        ['build'],
        done
    );
})

gulp.task('default', ['build:watch']);
