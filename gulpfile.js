var gulp = require('gulp'),
  html5Lint = require('gulp-html5-lint'),
  eslint = require('gulp-eslint'),
  sasslint = require('gulp-sass-lint'),
  connect = require('gulp-connect');

var paths = {
  js: ['js/*.js'],
  images: 'assets/**/*',
  sass: ['_scss/**/*.scss'],
  jekyll: ['_layouts/*.html', '_posts/*']
};

gulp.task('fa', function(){
  gulp.src(['bower_components/fontawesome/fonts/fontawesome-webfont.*'], {})
    .pipe(gulp.dest('css/fonts'));
});

gulp.task('html5-lint', function() {
  return gulp.src('./_site/*.html')
    .pipe(html5Lint());
});

gulp.task('eslint', function () {
  return gulp.src(['./_site/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('scsslint', function () {
  gulp.src(['./_scss/*.scss', '!./_scss/syntax.scss', '!./_scss/font-awesome.scss', '!./_scss/foundation.scss'])
      .pipe(sasslint())
      .pipe(sasslint.format())
      .pipe(sasslint.failOnError())
});

gulp.task('connect', function() {
  connect.server({
    root: __dirname,
    livereload: true
  });
});

// Watch for changes
gulp.task('watch', function() {
  //gulp.watch(paths.scripts, ['js']);
  //gulp.watch(paths.sass, ['scss']);
  gulp.watch(['*.html', '*/*.html', '*/*.md', '!_site/**', '!_site/*/**'], ['jekyll']);
  // gulp.watch(paths.images, ['images']);

  // When a file in the _site directory changes, tell livereload to reload the page
  gulp.watch(['_site/*/**']).on('change', function (file) {
    connect.reload();
  });

});

// tasks
gulp.task('default', ['html5-lint', 'eslint', 'scsslint']);
