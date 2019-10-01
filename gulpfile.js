const { src, dest, watch, series, parallel } = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer');
const browserSync = require('browser-sync').create()

const files = {
  htmlPath: 'src/**/*.html',
  scssPath: 'src/scss/**/*.scss',
  jsPath: 'src/js/**/*.js',
  imgPath: "src/img/*",
  resPath: '/src/res/**/*'
}

// Task copy images
function imgTask() {
  return src(files.imgPath)
    // Minifying images
    .pipe(imagemin())
    .pipe(dest("pub/img"))
    .pipe(browserSync.stream())
}

// Task copy resources
function resTask() {
  return src('./src/res/**/*')
    .pipe(newer('./pub/res'))
    .pipe(dest('./pub/res'));
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
    .pipe(uglify())
    .pipe(dest('pub/js'))
    .pipe(browserSync.stream())
}

// Task: Convert scss to css
function scssTask() {
  return src(files.scssPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(dest('pub/css'))
    // Make sure changes shows in browsers
    .pipe(browserSync.stream())
}

// Task: Watcher
function watchTask() {
  browserSync.init({
    server: {
      baseDir: 'pub/'
    }
  })
  watch(
    [files.htmlPath, files.jsPath, files.scssPath, files.imgPath, files.resPath],
    parallel(htmlTask, jsTask, scssTask, imgTask, resTask)
  )
}

exports.default = series(parallel(htmlTask, jsTask, scssTask, imgTask, resTask), watchTask)
