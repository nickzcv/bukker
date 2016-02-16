(function (require, __dirname) {
	'use strict';

	var gulp = require('gulp'),
		less = require('gulp-less'),
		sourcemaps = require('gulp-sourcemaps'),
		server = require('gulp-express'),
		minify_css = require('gulp-minify-css'),
		glue = require('gulp-glue');

	gulp.task('default', ['serve', 'sprite', 'less', 'watch']);

	gulp.task('serve', function () {
		server.run(['.']);
	});

	gulp.task('watch', function () {
		gulp.watch('views/**/*.handlebars', server.notify);
		gulp.watch('css/**/*.css', server.notify);
		gulp.watch('less/**/*.less', ['less']);
		gulp.watch('sprite/*', ['sprite']);
	});

	gulp.task('less', function () {
		gulp.src('less/index.less')
			.pipe(sourcemaps.init())
			.pipe(less())
			.pipe(minify_css())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('css'));
	});

	gulp.task('sprite', function () {
		gulp.src('sprite')
			.pipe(glue({
				source: 'sprite',
				output: 'css',
				less: 'less',
				namespace: 'bukker',
				retina: true,
				margin: 1
			}));
	});

}(require, __dirname));
