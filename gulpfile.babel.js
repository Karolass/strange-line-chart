import gulp from 'gulp'
import ejs from 'gulp-ejs'
import sass from 'gulp-sass'
import browserSync from 'browser-sync'
const server = browserSync.create()
const reload = server.reload

/* for javascript */
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import gutil from 'gulp-util'
import uglify from 'gulp-uglify'
// import sourcemaps from 'gulp-sourcemaps'
import gulpIf from 'gulp-if'
import eslint from 'gulp-eslint'

const inPaths = {
  html: './src/*.ejs',
  sass: './src/css/*.scss',
  eslint: './src/js/**',
  js: './src/js/index.js'
}
const outPaths = {
  html: './dist',
  css: './dist/css',
  eslint: './src/js/',
  js: './dist/js',
  images: './dist/images'
}

function isFixed(file) {
  return file.eslint != null && file.eslint.fixed
}

gulp.task('default', ['html', 'sass', 'eslint', 'js', 'assets'])
gulp.task('watch', ['default', 'watcher'])

gulp.task('watcher', () => {
  server.init({
    port: 9090,
    server: {
      baseDir: './dist',
      index: 'index.html'
    }
  })
  gulp.watch(inPaths.html, ['html']).on('change', reload)
  gulp.watch(inPaths.sass, ['sass']).on('change', reload)
  gulp.watch(inPaths.eslint, ['eslint', 'js']).on('change', reload)
})

gulp.task('html', () => {
  gulp.src(inPaths.html)
    .pipe(ejs({}, { ext: '.html' }))
    .pipe(gulp.dest(outPaths.html))
})

/* outputStyle: nested, expanded, compact, compressed */
gulp.task('sass', () => {
  gulp.src(inPaths.sass)
    .pipe(sass({ outputStyle: 'expanded', indentWidth: 2 }))
    .pipe(gulp.dest(outPaths.css))
})

/* useEslintrc: true, to use .eslintrc setting.
 * fix: true, to autofix js
 */
gulp.task('eslint', () => {
  gulp.src(inPaths.eslint)
    .pipe(eslint({ useEslintrc: true, fix: true }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest(outPaths.eslint)))
})

/* uglify mangle: false, to skip mangle */
gulp.task('js', () => {
  browserify({
    entries: inPaths.js,
    debug: true,
    standalone: 'trend',
  })
    .transform('babelify', { presets: ['es2015', 'es2017']})
    .bundle()
    .pipe(source('trend.js'))
    .pipe(buffer())
    .pipe(uglify({ mangle: false })).on('error', gutil.log)
    .pipe(gulp.dest(outPaths.js))
})

gulp.task('assets', () => {
  gulp.src('./src/assets/*.png')
    .pipe(gulp.dest(outPaths.images))

  gulp.src('./src/assets/*.css')
    .pipe(gulp.dest(outPaths.css))

  gulp.src('./src/assets/*.js')
    .pipe(gulp.dest(outPaths.js))
})
