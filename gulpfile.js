const { src, dest, series, parallel } = require('gulp');
const rename = require('gulp-rename');
const clean = require('gulp-clean-fix');

const minifyHTML = require('gulp-html-minifier-terser');
const minifyJS = require('gulp-uglify');
const minifyCSS = require('gulp-uglifycss');

const sass = require('gulp-sass');
const babel = require('gulp-babel');

const cssimport = require("gulp-cssimport");
const jsimport = require("gulp-js-import");

const image = require('gulp-image');
const webp = require('gulp-webp');

const uncss = require('gulp-uncss');

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
    .pipe(jsimport({hideConsole: true}))
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(minifyJS())
    .pipe(rename({basename:'main',extname:'.min.js'}))
    .pipe(dest('public/assets/js'));
}

function css() {
    return src('src/css/index.css')
    .pipe(cssimport({
        extensions: ["css", "scss"]
    }))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({basename:'main', extname:'.min.css'}))
    .pipe(dest('public/assets/css'));
}

function killCss() {
    return src('public/assets/css/main.min.css')
    .pipe(uncss({
        html: ['./public/index.html']
    }))
    .pipe(dest('public/assets/css'));
}

function images() {
    return src('src/images/*')
    .pipe(image())
    .pipe(webp())
    .pipe(dest('public/assets/images/'));
}

exports.default = series(
    cleaner,
    parallel(html, js, images),
    css,
    killCss
);

exports.noImages = series(
    parallel(html, js),
    css,
    killCss
);

// Watch files

exports.watchAll = () => {
    watch('src/html/*', html);
    watch('src/js/*.js', js);
    watch('src/css/*', series(
        css,
        killCss
    ));
    watch('src/images/*', images);
}

exports.watchHtml = () => {
    watch('src/html/*', html);
}

exports.watchCss = () => {
    watch('src/css/*', series(
        css,
        killCss
    ));
}

exports.watchJs = () => {
    watch('src/js/*.js', js);
}

exports.watchImages = () => {
    watch('src/images/*', images);
}

// Only one type of files

exports.onlyHtml = series(
    html
);

exports.onlyCss = series(
    css,
    killCss
);

exports.onlyJs = series(
    js
);

exports.onlyImages = series(
    images
);
