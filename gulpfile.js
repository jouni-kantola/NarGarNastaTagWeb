var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  scripts: ['web/scripts/**/*.js', '!web/scripts/vendor/*'],
  tests: 'web/tests/scripts/specs/*.js'
};

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('nargarnastatag.min.js'))
    .pipe(gulp.dest('web/build/js'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.tests, ['tests']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'watch']);