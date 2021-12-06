const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const babelify = require('babelify');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify-es').default;
const terser = require('gulp-terser');
const concat = require('gulp-concat-css');
const file = require('gulp-file');
const rename = require('gulp-rename');
const del = require('del');

const dateTime = new Date().getTime();

async function clearFolderJs() {
  return del.sync('./static/js/**/*');
}

async function clearFolderCss() {
  return del.sync('./static/css/dist/**/*');
}

function js() {
  return browserify({
    entries: ['./static/src/js/define.js', './static/src/js/app.js'],
    debug: true,
  })
    .transform(babelify, {
      presets: ['@babel/preset-env'],
      plugins: ['@babel/transform-runtime', 'angularjs-annotate'],
    })
    .bundle()
    .pipe(plumber())
    .pipe(source('app.js', './static/src/js'))
    .pipe(buffer())
    .pipe(
      rename(function (path) {
        return {
          dirname: path.dirname,
          basename: 'app-' + dateTime,
          extname: '.js',
        };
      }),
    )
    .pipe(
      minify({
        ext: {
          src: '-debug.js',
          min: '.js',
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js'],
      }),
    )
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./static/js'));
}

async function jsonConfig() {
  return await file(
    'app.json',
    JSON.stringify({
      jsFileName: 'app-' + dateTime + '.js',
      cssFileName: 'app-' + dateTime + '.css',
    }),
  ).pipe(gulp.dest('./static/json'));
}

function copyPhotoswipeFiles() {
  return gulp
    .src([
      './static/src/css/default-skin/*.gif',
      './static/src/css/default-skin/*.svg',
      './static/src/css/default-skin/*.png',
    ])
    .pipe(gulp.dest('./static/css/default-skin'));
}

function concatCss() {
  return gulp
    .src([
      './static/src/css/photoswipe.css',
      './static/src/css/default-skin/default-skin.css',
      './static/css/app.css',
    ])
    .pipe(concat('app.min.css', {}))
    .pipe(gulp.dest('./static/css'))
    .once('end', function () {
      return copyPhotoswipeFiles();
    });
}

function css() {
  return gulp
    .src(['./static/src/scss/app.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(
      rename(function (path) {
        return {
          dirname: path.dirname + '/dist',
          basename: 'app-' + dateTime,
          extname: '.css',
        };
      }),
    )
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./static/css'))
    .once('end', function () {
      return concatCss();
    });
}

function watcher() {
  gulp.watch('./static/src/css/**/*.css', gulp.parallel([css]));
  gulp.watch('./static/src/scss/**/*.scss', gulp.parallel([css]));
  gulp.watch('./static/src/**/*.js', js);
  gulp.parallel(jsonConfig);
}

gulp.task(
  'build',
  gulp.parallel(clearFolderJs, clearFolderCss, jsonConfig, css, js),
);

gulp.task('watch', gulp.parallel('build', watcher));
