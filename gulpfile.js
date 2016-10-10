// Created by Bilal Duckett on 7/3/2016

// grab our gulp packages
var gulp  = require('gulp'),
		gutil = require('gulp-util'),
		jshint = require('gulp-jshint'),
		sass = require('gulp-sass'),
		cleancss = require('gulp-clean-css'),
		sourcemaps = require('gulp-sourcemaps'),
		autoprefixer = require('gulp-autoprefixer'),
		concat = require('gulp-concat'),
		browserSync = require('browser-sync').create();

var config = {
	bootstrapDir: 'node_modules/bootstrap/',
	publicDir: './dist'
};

// configure the jshint task
gulp.task('jshint', function() {
	return gulp.src('js/source/*.js')
			.pipe(jshint())
			.pipe(jshint.reporter('jshint-stylish'));
});

//compile css

gulp.task('styles', function(){
	gulp.src(['sass/**/*.scss'])
			.pipe(sourcemaps.init())
			.pipe(sass(
					{
						includePaths: [config.bootstrapDir]
					}
			).on('error', sass.logError))
			.pipe(autoprefixer({
				browsers: ['last 3 versions']
			}))
			.pipe(cleancss())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('css'))
			.pipe(browserSync.stream())
});

//compile js

gulp.task('build-js', function() {
	return gulp.src('js/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(concat('main.js'))
			//only uglify if gulp is ran with '--type production'
			.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('js'));
});

// configure which files to watch and what tasks to use on file changes, set test serve

gulp.task('watch', function(){
	browserSync.init(
			{
				proxy: "loc.duckdigital.io"
			}
	);
	gulp.watch(['*.html','sass/**/*.scss', 'js/**/*.js', 'templates/**/*'], ['styles', 'jshint']).on('change', browserSync.reload);
});