var gulp = require('gulp');

// CSS
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var groupMediaQueries = require('gulp-group-css-media-queries');
// JS
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var browserSync = require('browser-sync').create();
var notify = require('gulp-notify');

gulp.task('html', function() {
  return gulp.src('public/*.html')
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src('public/sass/**')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .on('error', notify.onError())
    .pipe(groupMediaQueries())
    .pipe(autoprefixer({
      browsers: ['last 4 versions']
    }))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('js', function() {
  return gulp.src('public/js/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

gulp.task('default', gulp.series('html', 'css', 'js', function(done) {
  browserSync.init({
    server: {
      baseDir: "public/"
    },
    port: 1337,
    notify: false
  });

  gulp.watch('public/*.html',  gulp.series('html'));
  gulp.watch('public/sass/**', gulp.series('css'));
  gulp.watch('public/js/main.js',   gulp.series('js'));
  done();
}));
