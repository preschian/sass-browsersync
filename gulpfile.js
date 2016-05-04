var gulp    = require('gulp');
var html    = require('gulp-processhtml');
var sass    = require('gulp-sass');
var source  = require('gulp-sourcemaps');
var serve   = require('browser-sync');
var path    = require('path');

// path
var BUILD   = './build';
var DIST    = './dist';
var PATH    = {
    HTML: {
        BUILD: path.join(BUILD, 'html/*.html'),
        WATCH: path.join(BUILD, 'html/**/*.html'),
        OUTPUT: DIST
    },
    SASS: {
        BUILD: path.join(BUILD, 'sass/*.scss'),
        WATCH: path.join(BUILD, 'sass/**/*.scss'),
        OUTPUT: path.join(DIST, 'assets/css')
    }
};

// task
gulp.task('live', ['sass', 'html'], function() {
    serve.init({
        notify: false,
        server: DIST
    });

    gulp.watch(PATH.SASS.WATCH, ['sass']);
    gulp.watch(PATH.HTML.WATCH, ['html']).on('change', serve.reload);
});

gulp.task('sass', function() {
    return gulp.src(PATH.SASS.BUILD)
        .pipe(source.init())
        .pipe(sass({ includePaths: 'node_modules/', outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(source.write())
        .pipe(gulp.dest(PATH.SASS.OUTPUT))
        .pipe(serve.stream());
});

gulp.task('sass:min', function() {
    return gulp.src(PATH.SASS.BUILD)
        .pipe(sass({ includePaths: 'node_modules/', outputStyle: 'compressed' }))
        .pipe(gulp.dest(PATH.SASS.OUTPUT));
});

gulp.task('html', function () {
    return gulp.src(PATH.HTML.BUILD)
        .pipe(html())
        .pipe(gulp.dest(PATH.HTML.OUTPUT));
});

gulp.task('default', ['live']);
gulp.task('minify', ['sass:min']);
