var gulp = require('gulp');
var $ = plugins = require('gulp-load-plugins')();
var path = require('path');
// var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var mongobackup = require('mongobackup');


/**
 *  paths
 */
var paths = {
    client: {
        lib: './public/dev/lib/**/*.js',
        js: './public/dev/js',
        app: './public/dev/js/**/*.js',
        sass: './public/dev/sass/**/*.scss',
        font: './public/dev/lib/fontawesome/fonts/**.*',
        views: './public/dev/js/views/**/*.html'
    },
    server : {
        js: './server/**/*.js',
        start: './server/app.js'
    },
    build: './public/build',
    styleguide: {
        src: './docs/style-guide/scss/style-guide.scss',
        dest: './docs/style-guide/css/',
    }
};

gulp.task('help', $.taskListing);

//
// CLIENT
//

/**
 * Watch JavaScript files and sass filesm,
 * run tasks if files changes
 *
 */
gulp.task('client', ['browser-sync'],function() {
    gulp.watch([paths.client.sass], ['sass']);
});

gulp.task('lint-ng', function() {
    lint(paths.client.app);
});

gulp.task('style-guide', function() {
    gulp.src(paths.styleguide.src)
        .pipe($.sass({
          includePaths: require('node-bourbon').includePaths,
          errLogToConsole: true
        }))
        .pipe($.concat('style-guide.css'))
        .pipe(gulp.dest(paths.styleguide.dest));
});

/**
 * run browser sync to inject css after sass complete
 *
 */
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        proxy: 'http://localhost:3000/',
        files: ['./public/build/main.css'],
        browser: 'google chrome',
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

gulp.task('views', function () {
    console.log($);
    gulp.src(paths.client.views)
        .pipe($.angularTemplatecache({
            module: 'templates'
        }))
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
    return $.nodemon({
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
    lint(paths.server.js);
});

// dump the database
gulp.task('dump', function() {
  mongobackup.dump({
    host : 'localhost',
    out : './dbdump/',
    db: 'coapp'
  });
});

// restore the database
gulp.task('restore', function() {
  mongobackup.restore({
    host : 'localhost',
    drop : true,
    path : './dbdump/coapp'
  });
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
