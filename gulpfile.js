(function (require, __dirname) {
	'use strict';

	var gulp = require('gulp'),
		less = require('gulp-less'),
		sourcemaps = require('gulp-sourcemaps'),
		minify_css = require('gulp-minify-css');

	gulp.task('default', ['less', 'watch']);
	gulp.task('once', ['less']);

	gulp.task('watch', function () {
		gulp.watch('less/**/*.less', ['less']);
	});

	gulp.task('less', function () {
		gulp.src('less/index.less')
			.pipe(sourcemaps.init())
			.pipe(less())
			.pipe(minify_css())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('css'));
	});

}(require, __dirname));