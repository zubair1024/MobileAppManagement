import gulp from 'gulp';
import cssmin from 'gulp-cssmin';
import concat from 'gulp-concat';

export default function minifyCSS() {
  gulp
    .src([
      './js/taggle.js-1.11.1/example/css/taggle.min.css',
      './css/materialize.css',
      './js/kendoui-professional/styles/kendo.common.min.css',
      './js/kendoui-professional/styles/kendo.material.min.css',
      './js/kendoui-professional/styles/kendo.material.mobile.min.css',
      './js/plugins/perfect-scrollbar/perfect-scrollbar.css',
      './css/style.css'
    ])
    .pipe(concat('main.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./css/'));
}
