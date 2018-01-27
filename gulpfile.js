var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');		// for future plugins

gulp.task('default', function () {
	console.log("Hello!");
});

gulp.task('scripts', function () {
    var stream = gulp.src('src/routes/*.js')
		.pipe(gulp.dest('.'));
});

gulp.task('watch', ['scripts'], function () {
    gulp.watch('src/routes/*.js', ['scripts']);
});
