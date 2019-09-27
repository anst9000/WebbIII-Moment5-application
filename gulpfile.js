const { src, dest, watch, series, parallel } = require('gulp')
const concat = require('gulp-concat')
const terser = require('gulp-terser');
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const del = require('del')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create()

const files = {
    htmlPath: 'src/**/*.html',
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js',
    imgPath: ['src/**/*.{gif,png,jpg,jpeg}'],
    imgPubPath: 'pub'
}

const imgTask = series(imgClean, imgMinify)

// Clean images
function imgClean() {
    return del(files.imgPubPath);
}

// Minifying images by imagemin
function imgMinify() {
    // return src('src/img/*')
    return src(files.imgPath)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(dest(files.imgPubPath))  // place images in img-folder
}


// Task: copy HTML
function htmlTask() {
    return src(files.htmlPath)
        .pipe(dest('pub'))
        .pipe(browserSync.stream())
}

// Concatenate and minify js-files
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('main.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(terser())
        .pipe(dest('pub/js'))
        .pipe(browserSync.stream())
}

// Task: Convert scss to css
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest('pub/css'))
        .pipe(browserSync.stream())     // Make sure changes shows in browsers
}


// Task: Watcher
function watchTask() {
    browserSync.init({
        server: {
            baseDir: 'pub/'
        }
    })

    watch(
        [files.htmlPath, files.jsPath, files.scssPath],
        parallel(htmlTask, jsTask, scssTask)
    ).on('change', browserSync.reload)
    watch(files.imgPath, imgTask).on('change', browserSync.reload)
}

exports.default = series(
    parallel(htmlTask, jsTask, scssTask, imgTask),
    watchTask
)
