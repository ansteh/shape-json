var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

var paths = {
  scripts: ['lib/**/*.js'],
  //spec: 'spec/test.js'
  spec: 'test/spec/**/*.js'
};

gulp.task('test', function () {
	return gulp.src(paths.spec)
		.pipe(jasmine());
});

gulp.task('watch', ['test'], function() {
  gulp.watch(paths.scripts, ['test']);
});

gulp.task('default', ['watch']);
