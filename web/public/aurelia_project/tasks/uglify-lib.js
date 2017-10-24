import gulp from 'gulp';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import project from '../aurelia.json';

export default function processUglifyLib() {
  return gulp
    .src([
      './js/jquery-1.11.2.min.js',
      './js/jszip.js',
      './js/moment.js',
      './js/moment.timezone.js',
      './js/materialize.min.js',
      './js/taggle.js-1.11.1/src/taggle.js',
      './js/particles.min.js',
      './js/plugins/perfect-scrollbar/perfect-scrollbar.min.js',
      './js/kendoui-professional/js/kendo.all.min.js'
    ])
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./scripts/'));
}
