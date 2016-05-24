var gulp = require('gulp'),
    concat    = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    html5Lint = require('gulp-html5-lint'),
    eslint = require('gulp-eslint'),
    sasslint = require('gulp-sass-lint'),
    //scsslint = require('gulp-scss-lint'),
    //sass        = require ('gulp-ruby-sass'),
    autoprefixer     = require ('gulp-autoprefixer'),
    uglify   = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    jekyll   = require('gulp-jekyll'),
    watch     = require('gulp-watch'),
    //jshint   = require("gulp-jshint"),
    deploy   = require("gulp-gh-pages"),
    rename   = require("gulp-rename"),
    cleancss   = require("gulp-clean-css"),
    gulp_connect = require('gulp-connect'),
    connect = require('connect'),
    livereload = require('livereload'),
    superstatic = require('superstatic'),
    //jshint = require("gulp-jshint"),
    //bower = require('gulp-bower'),
    cp    = require('child_process'),
    spawn   = require('child_process').spawn,
    plumber = require('gulp-plumber'),
    debug = require('gulp-debug');

var paths = {
    scripts: ['js/*.js'],
    js: ['js/*.js', '!*.min.js'],
    images: 'assets/**/*',
    sass: ['_scss/**/*.scss'],
    jekyll: ['_layouts/*.html', '_posts/*', '_sites'],
    dist: ['../dist']
};

// gulp.task('bower', function() {
//   bower()
//     .pipe(gulp.dest('lib/'));

//   var vendorStream = gulp.src(['./bower_components/*/*.js'])
//     .pipe(concat('vendors.js'))
//     .pipe(gulp.dest('./dist'));

// });

// gulp.task('html', function() {
//    return gulp.src([ + '/*.html',  + '/**/*.html',  + '/*.md',  + '/**/*.md'])
//     .pipe(connect.reload());
// })

// Run Jekyll Build Asynchronously
gulp.task('jekyll1', function () {
    var jekyll = spawn('bundle', ['exec jekyll build']);

    jekyll.on('exit', function (code) {
        console.log('-- Finished Jekyll Build --')
    });

    gulp.src(paths.jekyll)
        .pipe(connect.reload());

});

gulp.task('jekyll2', function () {
    gulp.src(['./index.html', './_layouts/*.html', './_posts/*.{markdown,md}'])
        .pipe(jekyll({
            source: './',
            destination: './deploy/',
            bundleExec: true
        }))
        .pipe(gulp.dest('./deploy/'));
});

gulp.task('jekyll', function (gulpCallBack){
    var spawn = require('child_process').spawn;
    var jekyll = spawn('jekyll', ['build'], {stdio: 'inherit'});

    jekyll.on('exit', function(code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    });
});

/*
 * Server
 */

gulp.task( 'connect', function() {
    var app = connect()
        .use(superstatic({
            config: {
                cleanUrls: true,
                public: './_site'
            }
        }));
        // .use(require('connect-livereload')({
        //     port: 35729
        // }));

    app.listen(3000, function() {

    });

    server = livereload.createServer();
    server.watch('_site');
});

/*
 * CSS
 */
gulp.task('style-prod', function() {
    return gulp.src({glob: 'scss/**/*.scss'})
        .pipe(plumber())
        .pipe(sass({ style: 'compact' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleancss())
        .pipe(gulp.dest('css'));
});

gulp.task('sass', function() {
    gulp.src(['./_scss/*.scss', '!./_scss/syntax.scss', '!./_scss/font-awesome.scss', '!./_scss/foundation.scss'])
    .pipe(sasslint({
        'cache-config': true
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
    //.pipe(scsslint())
    //.pipe(scsslint.failReporter())
    //.pipe(scsslint.format())
    //.pipe(scsslint.failOnError());
    //scsslint

    return gulp.src('_scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 1 version']}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('tmp'));
});


// gulp.task('scsslint', function () {
//     gulp.src(['./_scss/*.scss', '!./_scss/syntax.scss', '!./_scss/font-awesome.scss', '!./_scss/foundation.scss'])
//         .pipe(sasslint())
//         .pipe(sasslint.format())
//         .pipe(sasslint.failOnError())
// });





gulp.task('css', function() {
    return gulp.src('tmp/main.css')
        .pipe(gulp.dest('_site/css'));
});

gulp.task('css-min', function() {
    return gulp.src('tmp/main.css')
        .pipe(cleancss())
        .pipe(gulp.dest('_site/css'));
});

/*
 * Scripts
 */
gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(paths.js)
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('_site/js'));
});

// gulp.task('eslint', function () {
//     return gulp.src(['./_site/js/*.js'])
//         .pipe(eslint())
//         .pipe(eslint.format())
//         .pipe(eslint.failOnError());
// });



/*
 * Images
 */
// Copy all static images
// gulp.task('images', function() {
//  return gulp.src(paths.images)
//     // Pass in options to the task
//     .pipe(imagemin({optimizationLevel: 5}))
//     .pipe(gulp.dest('build/img'));
// });

/*
 * Scripts
 */
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.sass, ['sass', 'css']);
    //gulp.watch(['*/*.html', '*/*.md', '!_site/**', '!_site/*/**'], ['jekyll']);
    gulp.watch(['*.md', 'index.html', '_includes/**/*.html', '_layouts/**/*.html', '_posts/**/*.md'], ['jekyll']);
    // gulp.watch(paths.images, ['images']);

    // When a file in the _site directory changes, tell livereload to reload the page
    // gulp.watch(['_site/*/**']).on('change', function (file) {
    //     connect.reload();
    // });

});

/*
 * Lint
 */
gulp.task('html5-lint', function() {
    return gulp.src('./_site/*.html')
        .pipe(html5Lint());
});

gulp.task('eslint', function () {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

/*
 * Bower
 */
gulp.task('bower', function(){
    gulp.src(['bower_components/fontawesome/fonts/fontawesome-webfont.*'], {})
        .pipe(gulp.dest('css/fonts'));
});

/*
 * Deploy
 */
//copy _site contents to dist dir and then commit/push
gulp.task('deploy', function () {
    gulp.src("../dist/**/*")
        .pipe(deploy(gitRemoteUrl, remote));
});

//move this after jekyll build?
gulp.task('lint', ['html5-lint']);

// The default task (called when you run `gulp` from cli)
gulp.task('dev', ['bower', 'lint', 'sass', 'css', 'scripts', 'connect', 'jekyll', 'watch']);
gulp.task('default', ['sass', 'css', 'connect', 'jekyll']);
gulp.task('prod', ['sass', 'css-min', 'connect', 'jekyll']);