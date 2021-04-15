const { src, dest, watch, series, parallel } = require('gulp')

const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const beautify = require('gulp-beautify');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const webpack = require('webpack-stream')
const browserSync = require('browser-sync').create();

function cleanDist() {
    return src('dist', {
        read: false,
        allowEmpty: true
    }).pipe(clean())
}

// Compile pug files into HTML
function html() {
  return src('src/pug/*.pug')
    .pipe(pug())
    .pipe(beautify.html({
        indentSize: 4
    }))
    .pipe(dest('dist'))
}

// Compile scss files into CSS
function styles() {
  return src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
        includePaths: ['src/scss'],
        errLogToConsole: true,
        outputStyle: 'compressed',
        onError: browserSync.notify
    }))
    .pipe(beautify.css({
        indentSize: 4
    }))
    .pipe(sourcemaps.write('./_maps'))
    .pipe(dest('dist/css'))    
    .pipe(browserSync.stream())
}

// Bundle js
function scripts() {
    return src('src/js/script.js')
        .pipe(webpack(require('./webpack.config.dev.js')))
        .pipe(dest('dist/js/'))
}

// Merge css libs
function csslibs() {
    return src([
        'src/vendors/bootstrap.min.css',
        'src/vendors/**/*.css'
    ]).pipe(concat('libs.css'))
        .pipe(dest('dist/css'))
}

// Merge js libs
function jslibs() {
    return src([
        'src/vendors/jquery.min.js',
        'src/vendors/**/*.js'
    ]).pipe(concat('libs.js'))
        .pipe(dest('dist/js'))
}

// Copy assets
function assets() {
    return src('src/assets/**')
        .pipe(dest('dist/assets'))
}

// Copy favicon
function favicon() {
    return src('src/favicons/*')
        .pipe(dest('dist/'))
}

// Serve and watch sass/pug files for changes
function watchAndServe() {
    browserSync.init({
        server: 'dist',
    })

    watch('src/scss/**', styles)
    watch('src/pug/**', html)
    watch('src/js/**', scripts)
    watch('src/vendors/**', parallel(csslibs, jslibs))
    watch('src/assets/**', assets)
    watch('src/favicons/**', assets)
    watch('dist/**').on('change', browserSync.reload)
}


exports.clean = cleanDist
exports.html = html
exports.csslibs = csslibs
exports.jslibs = jslibs
exports.styles = styles
exports.scripts = scripts
exports.watch = watchAndServe
exports.default = series(cleanDist, favicon, assets, html, styles, csslibs, jslibs, scripts, watchAndServe)
