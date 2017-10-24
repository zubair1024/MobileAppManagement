import gulp from 'gulp';
// import uglify from 'gulp-uglify';
import uglifyjs from 'uglify-js-harmony';
import minifier from 'gulp-uglify/minifier';
import concat from 'gulp-concat';
import project from '../aurelia.json';

export default function processUglifyUtil() {
  return gulp
    .src(['./js/config.js', './js/util.js'])
    .pipe(concat('util.min.js'))
    .pipe(minifier({}, uglifyjs))
    .pipe(gulp.dest('./scripts/'));
}
