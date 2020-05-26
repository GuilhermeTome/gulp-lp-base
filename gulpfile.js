const { src, dest, series, parallel } = require('gulp');
const rename = require('gulp-rename');
const minifyHTML = require('gulp-html-minifier-terser');
const minifyJS = require('gulp-uglify');
const minifyCSS = require('gulp-uglifycss');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const cssimport = require('gulp-cssimport');
const image = require('gulp-image');
var clean = require('gulp-clean-fix');

function cleaner() {
    return src('public/*', {read:false})
    .pipe(clean());
}

function html() {
    return src('src/templates/*.html')
    .pipe(minifyHTML({ collapseWhitespace: true }))
    .pipe(dest('public/'));
}

function js() {
    return src('src/js/*.js')
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(minifyJS())
    .pipe(rename({extname:'.min.js'}))
    .pipe(dest('public/assets/js'));
}

function css() {
    return src('src/css/*.css')
    .pipe(cssimport())
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({extname:'.min.css'}))
    .pipe(dest('public/assets/css'));
}

function base() {
    return src('src/css/base.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({extname:'.min.css'}))
    .pipe(dest('public/assets/css'));
}

function images() {
    return src('src/images/*')
    .pipe(image())
    .pipe(dest('public/assets/images/'));
}

exports.default = series(
    cleaner,
    parallel(html, js, base, images)
);