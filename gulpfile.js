var gulp         = require('gulp')
var uglify       = require('gulp-uglify')
var clean        = require('gulp-clean')
var notify       = require('gulp-notify')
var autoprefixer = require('gulp-autoprefixer')
var gulpSequence = require('gulp-sequence')
var sass         = require('gulp-sass')
var plumber      = require('gulp-plumber')
var minimist     = require('minimist')
var babel        = require('gulp-babel')
var rename = require("gulp-rename");
var changed = require('gulp-changed');
var stripDebug = require('gulp-strip-debug')
var removeLogs = require('gulp-removelogs')

var knownOptions = {
  string  : 'env',
  default : { env: process.env.NODE_ENV || 'development' }
};
var options = minimist(process.argv.slice(2), knownOptions);

const BASE   = 'src'
const PRO_BASE = 'dist'
const DEV_BASE = 'build'
const BUILD_BASE = options.env == 'development' ? DEV_BASE : PRO_BASE
// console.log('编译命令: gulp build, 开发编译命令: gulp dev')

// gulp.task('default', function() {
//   return gulp.src([`${BASE}/**`, `!${BASE}/**/**.js`])
//           .pipe(babel({
//             presets: ['es2015']
//           }))
//           .pipe(stripDebug())
//           .pipe(uglify({ mangle: false }))
//           .pipe(removeLogs())
//           .pipe(gulp.dest(`${PRO_BASE}`))
// })

gulp.task('compileJs', function(){
  return gulp.src([`${BASE}/**.js`, `${BASE}/**/**.js`, `!${BASE}/js/bluebird.js`, `!${BASE}/js/weapp.qrcode.esm.js`])
          // .pipe(babel())
          // .pipe(uglify())
          .pipe(gulp.dest(`${PRO_BASE}`))
})

gulp.task('removeLog', function(){
  return gulp.src([`${BASE}/**.js`, `${BASE}/**/**.js`])
          .pipe(stripDebug())
          .pipe(removeLogs())
          .pipe(gulp.dest(`${PRO_BASE}`))
})

gulp.task('build', function () {
  gulpSequence('clean', ['compileJs', 'copy', 'scss'], function () {
    console.log('编译完成')
  })
})

gulp.task('clean', function() {
  return gulp.src([`${PRO_BASE}/*`], {read: false})
    .pipe(clean())
    .pipe(notify({ message: '清除完成' }))
})

gulp.task('copy', function () {
  return gulp.src(['src/**', '!src/**/**.scss'])
    .pipe(changed(PRO_BASE))
    .pipe(gulp.dest(`${PRO_BASE}`))
})

gulp.task('dev', ['watch'])

gulp.task('watch', function () {
  gulp.watch([`${BASE}/**/**.scss`], ['scss'])
  gulp.watch([`${BASE}/**/**.*`, `!${BASE}/**/**.scss`], ['copy'])
})

gulp.task('scss', function () {
  return gulp.src([`${BASE}/**/**.scss`, `!${BASE}/style/**/**.scss`])
  .pipe(changed(PRO_BASE), {
    extension: '.wxss'
  })
  .pipe(plumber())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(plumber())
  .pipe(rename(function (path) {
    path.extname = ".wxss"
  }))
  .pipe(gulp.dest(`${PRO_BASE}`))
})

gulp.task('clearlog', ['removeLog'])
