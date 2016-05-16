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



// Run Jekyll Build Asynchronously
gulp.task('jekyll', function () {
    var jekyll = spawn('bundle', ['exec jekyll build']);

    jekyll.on('exit', function (code) {
        console.log('-- Finished Jekyll Build --')
    });

    gulp.src(paths.jekyll)
        .pipe(connect.reload());

});

/*
 * Server
 */
gulp.task('connect', function() {
    connect.server({
        root: __dirname,
        livereload: true
    });
});

/*
 * CSS
 */
gulp.task('style', function() {
    return gulp.src({glob: 'scss/**/*.scss'})
        .pipe(plumber())
        .pipe(sass({ style: 'compact' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('css'));
});

gulp.task('style-dev', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass({
            debugInfo   : true,
            lineNumbers : true,
            sourcemap: true,
            // loadPath    : 'scss',
            style       : 'expanded'
        }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('css'));
});

/*
 * Scripts
 */
gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('js'))
        .pipe(connect.reload());
});

// Watch for changes
// gulp.task('watch', function() {
//     //gulp.watch(paths.scripts, ['js']);
//     //gulp.watch(paths.sass, ['scss']);
//     gulp.watch(['*.html', '*/*.html', '*/*.md', '!_site/**', '!_site/*/**'], ['jekyll']);
//     // gulp.watch(paths.images, ['images']);
//
//     // When a file in the _site directory changes, tell livereload to reload the page
//     gulp.watch(['_site/*/**']).on('change', function (file) {
//         connect.reload();
//     });
//
// });

/*
 * Scripts
 */
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.sass, ['styles-dev']);
    gulp.watch(['*.html', '*/*.html', '*/*.md', '!_site/**', '!_site/*/**'], ['jekyll']);
    // gulp.watch(paths.images, ['images']);

    // When a file in the _site directory changes, tell livereload to reload the page
    gulp.watch(['_site/*/**']).on('change', function (file) {
        connect.reload();
    });

});

// tasks
gulp.task('default', ['html5-lint', 'eslint', 'scsslint']);

gulp.task('test', ['style-dev', 'connect', 'jekyll',  'watch']);
