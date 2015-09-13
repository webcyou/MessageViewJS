var gulp = require("gulp"),
    path = require('path'),
    compass = require('gulp-compass'),
    cssmin = require('gulp-cssmin'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    stripDebug = require('gulp-strip-debug'),
    mainBowerFiles = require('main-bower-files'),
    del = require('del'),
    runSequence = require('run-sequence'),
    gulpif= require('gulp-if');

var SOURCE_DIR = 'src',
    WORK_DIR = 'demo',
    DIST_DIR = 'dist';

var htmlFiles = SOURCE_DIR + '/html/**/*.html';
var scssFiles = SOURCE_DIR + '/scss/**/*.scss';
var jsFiles = [
    SOURCE_DIR + '/js/**/*.js',
    '!src/js/contrib/**/*.js'
];
var imgFiles = SOURCE_DIR + '/img/**/*.{jpg,png,gif,ico}';
var cssFiles = SOURCE_DIR + '/**/*.css';
var bootstrapCSSFiles = 'bower_components/bootstrap/dist/css/**/**.css';
var bootstrapFontFiles = 'bower_components/bootstrap/dist/fonts/**/**.ttf';

// Clean File
gulp.task('clean-workDir', function() {
    del([WORK_DIR + '/*'], {force: true});
});

// Compass Setting
gulp.task('compass', function() {
    return gulp.src(scssFiles)
        .pipe(plumber())
        .pipe(compass({
            style: 'expanded',
            specify: SOURCE_DIR + '/scss/style.scss',
            css: SOURCE_DIR + '/css',
            sass: SOURCE_DIR + '/scss',
            imagesDir: SOURCE_DIR + '/img'
        }));
});

gulp.task('cssmin', function() {
    gulp.src(cssFiles)
        .pipe(cssmin())
        .pipe(gulp.dest(WORK_DIR));
});

// bower uglify contrib
gulp.task('uglify-contrib', function () {
    gulp.src(mainBowerFiles())
        .pipe(gulpif(function(file){
                return file.path.substr(-3) === '.js';
            },
            //uglify()
            concat('contrib.js')
        ))
        .pipe(
            gulpif(function(file) {
                return file.path.substr(-3) === '.js';
            },
            gulp.dest(WORK_DIR + '/js/')
        ));
});

/**
 * Copy Files
**/
gulp.task('copy-img', function() {
    gulp.src(imgFiles).pipe(gulp.dest(WORK_DIR + '/img'));
});
gulp.task('copy-html', function() {
    gulp.src([
        htmlFiles,
        '!' + SOURCE_DIR + '/html/index.html'
    ]).pipe(gulp.dest(WORK_DIR + '/html'));
    gulp.src(SOURCE_DIR + '/html/index.html').pipe(gulp.dest(WORK_DIR));
});
gulp.task('copy-js', function() {
    gulp.src(jsFiles).pipe(gulp.dest(WORK_DIR + '/js'));
});
gulp.task('copy-bootstrap', function() {
    gulp.src(bootstrapCSSFiles).pipe(gulp.dest(WORK_DIR + '/bootstrap/css'));
    gulp.src(bootstrapFontFiles).pipe(gulp.dest(WORK_DIR + '/bootstrap/font'));
});

gulp.task('dist', function() {
    gulp.src(SOURCE_DIR + '/js/message_view.js')
        .pipe(gulp.dest(DIST_DIR));

    gulp.src(SOURCE_DIR + '/js/message_view.js')
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('copy-workDir', [
    'copy-html',
    'copy-js',
    'copy-img',
    'copy-bootstrap',
    'cssmin'
]);


/**
 * Watch Files
 **/
gulp.task('watch', function() {
    // html
    gulp.watch([htmlFiles],['copy-html']);
    // compass
    gulp.watch([scssFiles],['compass']);
    // css min
    gulp.watch([cssFiles],['cssmin']);
    // javaScript
    gulp.watch([jsFiles],['copy-js']);
    // image
    gulp.watch([imgFiles],['copy-img']);
});


// build task
gulp.task('build-ui', ['compass']);


/**
 * Gulp Server
 **/
gulp.task('serve', ['connect'], function() {
    gulp.watch([
        SOURCE_DIR + '/**/*.*'
    ]).on('change', function(changedFile) {
        gulp.src(changedFile.path).pipe(connect.reload());
    });
});

gulp.task('connect', function() {
    connect.server({
        root: [__dirname + '/demo/'],
        port: 8088,
        livereload: true
    });
});


// default
gulp.task('default', function(callback) {
    runSequence(
        'clean-workDir',
        'build-ui',
        'copy-workDir',
        'watch',
        'serve',
        callback
    );
});