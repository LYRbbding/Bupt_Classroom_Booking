var gulp = require('gulp');
var tiny = require('gulp-tinypng-nokey');

gulp.task('tinypng', function (cb) {
  gulp.src('https://www.baidu.com/img/bd_logo1.png')
    .pipe(tiny())
    .pipe(gulp.dest('dist'));
});