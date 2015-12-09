var gulp = require('gulp'),
  html5Lint = require('gulp-html5-lint'),
  eslint = require('gulp-eslint'),
  scsslint = require('gulp-scss-lint');

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


gulp.task('scsslint', function() {
  return gulp.src(['./_scss/*.scss', '!./_scss/theme.scss', '!./_scss/syntax.scss', '!./_scss/font-awesome.scss'])
    .pipe(scsslint({
      'config': './.scss-lint.yml'
    }))
    .pipe(scsslint.failReporter());
});

// tasks
gulp.task('default', ['html5-lint', 'eslint', 'scsslint']);
