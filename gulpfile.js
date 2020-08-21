const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');

const paths = {
    styles: {
        src: 'sass/**/*.scss',
        dest: 'css/'
    }
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass({ outputStyle : 'compressed' }))
		.pipe(gulp.dest(paths.styles.dest));
}

function watch () {
    gulp.watch(paths.styles.src, styles)
}

exports.styles = styles
exports.watch = watch