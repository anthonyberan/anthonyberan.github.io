var gulp = require('gulp'),
    concat    = require('gulp-concat'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
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
    return gulp.src(paths.scripts)
        .pipe(plumber())
        //.pipe(jshint()) //replace with eshint from old repo
        .pipe(jshint.reporter("default"))
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('js'))
        .pipe(connect.reload());
});


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
 * Deploy
 */
gulp.task('deploy', function () {
    gulp.src("../dist/**/*")
        .pipe(deploy(gitRemoteUrl, remote));
});


// The default task (called when you run `gulp` from cli)
gulp.task('dev', ['sass', 'css', 'connect', 'jekyll', 'watch']);
gulp.task('default', ['sass', 'css', 'connect', 'jekyll']);
gulp.task('prod', ['sass', 'css-min', 'connect', 'jekyll']);