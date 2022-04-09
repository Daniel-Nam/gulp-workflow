const { watch, series, dest, src } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const pug = require('gulp-pug')

function sassTask() {
	return src('src/sass/**/*.scss')
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('public/css'))
}

function jsTask() {
	return src('src/scripts/**/*.js')
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(dest('public/scripts'))
}

function pugTask() {
	return src('src/*.pug')
		.pipe(
			pug()
		)
		.pipe(dest('public'))
}

function browserSyncServer(cb) {
	browserSync.init({
		server: {
			baseDir: 'public',
		},
	})
	cb()
}

function browserSyncReload(cb) {
	browserSync.reload()
	cb()
}

function watchTask() {
	watch('*.html', browserSyncReload)
	watch(
		['src/**/*.pug', 'src/sass/**/*.scss', 'src/scripts/**/*.js'],
		series(pugTask, sassTask, jsTask, browserSyncReload)
	)
}

exports.default = series(
	pugTask,
	sassTask,
	jsTask,
	browserSyncServer,
	watchTask
)
