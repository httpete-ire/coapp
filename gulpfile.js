var gulp = require('gulp');
var $ = plugins = require('gulp-load-plugins')();
var path = require('path');
var browserSync = require('browser-sync');


/**
 *  paths
 */
var paths = {
    client: {
        js: './public/dev/js',
        app: './public/dev/js/**/*.js',
        sass: './public/dev/sass/*.scss'
    },
    server : {
        js: './server/**/*.js',
        start: './server/app.js'
    },
    build: './public/build'
};


//
// CLIENT
//

/**
 * lint client angular app
 *
 */
gulp.task('client', ['browser-sync'],function() {
    gulp.watch([paths.client.app], ['lint-ng']);
    gulp.watch([paths.client.sass], ['sass']);
});

gulp.task('lint-ng', function() {
    lint(paths.client.app);
});

/**
 * run browser sync to inject css after sass complete
 *
 */
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["./public/build/main.css"],
        browser: "google chrome",
        port: 7000,
    });
});

/**
 * compile SASS
 */
gulp.task('sass', function () {
    return gulp.src(paths.client.sass)
        .pipe($.sass())
        .pipe($.concat('main.css'))
        .pipe(gulp.dest(paths.build))
        .pipe($.filter('**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('clean', function () {
    return gulp.src(paths.build)
            .pipe($.clean());
});

gulp.task('ng', function () {
    return gulp.src(paths.client.app)
        .pipe($.clean())
        .pipe($.ngAnnotate())
        .pipe(gulp.dest(paths.client.js));
});

gulp.task('build', function () {
    return gulp.src(paths.client.app)
        .pipe($.ngAnnotate())
        .pipe($.concat('app.min.js'))
        .pipe($.uglify())
        .pipe(gulp.dest(paths.build));
});

//
// SERVER
//

/**
 * lint client angular app
 *
 */
gulp.task('server-dev', function() {
    $.nodemon({
        script: paths.server.start,
        ext: 'html js',
        ignore: ['ignored.js']
    })
    .on('change', ['server-lint'])
    .on('restart', function () {
      console.log('restarted!');
    })
});

gulp.task('server-lint', function() {
    lint(paths.server.jshint);
});

/**
 * Helper functions
 */
function lint (src) {
    return gulp.src(src)
        .pipe($.jshint('./.jshintrc'))
        .pipe($.notify({
            onLast: false,
            message: function (file) {
                if (file.jshint.success) {
                // Don't show something if success
                return false;
                }
            // create a string that contains error details
                var errors = file.jshint.results.map(function (data) {
                    if (data.error) {
                        return 'line ' + data.error.line + ' : ' +  data.error.reason;
                    }
                }).join('\n'); // join error messages with a new line

                return errors;
            },
            title: function (file) {
                return 'File : ' + file.relative;
            },
            sound: 'Submarine',
            icon: path.join(__dirname, 'gulp.png')
    }));
}
