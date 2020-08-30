"use sctrict"

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps")
const server = require("browser-sync");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const del = require("del");

gulp.task("html", function () {
  return gulp.src("src/pug/index.pug")
    .pipe(pug())
    .pipe(gulp.dest("build"))
});

gulp.task("css", function () {
  return gulp.src("src/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream())
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("copy", function () {
  return gulp.src([
    "src/fonts/**/*.{woff2,woff}",
    "src/img/**",
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build"))
});

gulp.task ("clean", function () {
  return del("build")
});

gulp.watch("src/pug/**/*.pug", gulp.series("html"));
gulp.watch("src/scss/**/*.scss", gulp.series("css"));
gulp.watch("src/*.html", gulp.series("refresh"));
gulp.watch("src/*.html").on("change", server.reload);

gulp.task("build", gulp.series("clean", "html", "css", "copy"));
gulp.task("start", gulp.series("build", "server"));
