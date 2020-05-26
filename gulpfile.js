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
    return src('src/html/*.html')
    .pipe(minifyHTML({ collapseWhitespace: true }))
    .pipe(dest('public/'));
}

function js() {
    return src('src/js/index.js')
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(minifyJS())
    .pipe(rename({basename:'main',extname:'.min.js'}))
    .pipe(dest('public/assets/js'));
}

function css() {
    return src('src/css/index.css')
    .pipe(cssimport())
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({basename:'main', extname:'.min.css'}))
    .pipe(dest('public/assets/css'));
}

function images() {
    return src('src/images/*')
    .pipe(image())
    .pipe(dest('public/assets/images/'));
}

exports.default = series(
    cleaner,
    parallel(html, js, css, images)
);

exports.noImages = series(
    parallel(html, js, css)
);

// Only one type of files

exports.onlyHtml = series(
    html
);

exports.onlyCss = series(
    css
);

exports.onlyJs = series(
    js
);

exports.onlyImages = series(
    images
);