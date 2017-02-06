var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var svgSprite = require("gulp-svg-sprites");
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');



gulp.task('default', function (callback) {
  runSequence(['sass','browserSync','sprites','images','watch'],
    callback
  )
})


gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('src/css/nonpre'))
 .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('src/scss/**/*.scss', ['sass']); 
  gulp.watch('src/css/nonpre/*.css',['autoprefixer']); 
  gulp.watch('src/fonts/**/*',['fonts']);
  gulp.watch('src/js/**/*.js',['useref']);
  gulp.watch('src/css/*.css',['useref']);
  gulp.watch('src/img/css/*.css',['useref']);
  gulp.watch('src/vgs/*.svg',['sprites']);
  gulp.watch('src/img/*.+(png|jpg|gif|svg)',['images']);
  // Other watchers
    gulp.watch('src/*.html', browserSync.reload); 
  gulp.watch('src/js/**/*.js', browserSync.reload); 
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  })
})

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('build'))
});

var config = {
    templates: {
        css: require("fs").readFileSync("./src/css/sprite.css", "utf-8")
    }
};

gulp.task('sprites', function () {
    return gulp.src('src/vgs/*.svg')
       .pipe(svgSprite(config))
        .pipe(gulp.dest("src/img"));
});

gulp.task('images', function(){
  return gulp.src('src/img/**/*.+(png|jpg|gif|svg)')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'))
});


 
gulp.task('autoprefixer', () =>
    gulp.src('src/css/nonpre/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css/'))
);