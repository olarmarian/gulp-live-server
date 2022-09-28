const gulp = require("gulp");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const livereload = require("gulp-livereload");
const htmlMin = require("gulp-htmlmin");
const htmlReplace = require("gulp-html-replace");
const connect = require("gulp-connect");
const open = require("gulp-open");

const buildHtml = () => {
  return gulp
    .src("src/index.html")
    .pipe(
      htmlReplace({
        css: "styles/style.min.css",
        js: "js/index.min.css",
      })
    )
    .pipe(
      htmlMin({
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        ignoreCustomComments: true,
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(livereload())
    .pipe(connect.reload());
};

const buildJs = () => {
  return gulp
    .src("./src/**/*.js")
    .pipe(uglify())
    .pipe(rename({ extname: ".min.js" }))
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());
};

const buildSass = () => {
  return gulp
    .src("sass/*.sass")
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(rename({ extname: ".min.css" }))
    .pipe(gulp.dest("dist/styles"))
    .pipe(livereload())
    .pipe(connect.reload());
};

const watchHtmlChanges = () => {
  livereload.listen();
  gulp.watch("src/index.html", buildHtml);
};
const watchJsChanges = () => {
  livereload.listen();
  gulp.watch("src/*.js", buildJs);
};

const watchSassChanges = () => {
  livereload.listen();
  gulp.watch("sass/*.sass", buildSass);
};

const build = () => {
  return gulp.series(
    gulp.parallel(buildJs, buildSass, buildHtml),
    gulp.parallel(
      gulp.parallel(connectServer, openWeb),
      gulp.parallel(watchJsChanges, watchSassChanges, watchHtmlChanges)
    )
  );
};

const connectServer = () => {
  connect.server({
    root: "dist",
    port: config.localServer.port,
    livereload: true,
  });
};

const openWeb = () => {
  return gulp
    .src("dist/index.html")
    .pipe(open({ uri: config.localServer.url }));
};

const config = (configuration = {
  paths: {
    dist: "./dist",
  },
  localServer: {
    port: 8001,
    url: "http://localhost:8001/",
  },
});

exports.build = build();
