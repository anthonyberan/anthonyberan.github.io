var gulp = require('gulp');

gulp.task('fa', function(){
    gulp.src(['bower_components/fontawesome/fonts/fontawesome-webfont.*'], {
    })
    .pipe(gulp.dest('css/fonts'));
});


gulp.task('default', ['fa']);
