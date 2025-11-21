import browserSync from "browser-sync";
import { deleteAsync } from "del"; // Используем del для очистки папки dist
import gulp from "gulp";
import autoprefixer from "gulp-autoprefixer";
import fileinclude from "gulp-file-include";
import fonter from "gulp-fonter";
import groupMedia from "gulp-group-css-media-queries";
import pug from "gulp-pug";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import * as dartSass from "sass";

const project_folder = "./docs";
const source_folder = "./src"; // Изменил на src, так как это более стандартное название
const { src, dest, series, parallel, watch } = gulp;
const sass = gulpSass(dartSass);
const bs = browserSync.create();

/* Paths */
const paths = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css/`,
    js: `${project_folder}/js/`,
    img: `${project_folder}/img/`,
    fonts: `${project_folder}/fonts/`,
    libs: `${project_folder}/libs/`,
    favicon: `${project_folder}/`,
    php: `${project_folder}/php/`,
    audio: `${project_folder}/audio/`,
    public: `${project_folder}/public/`,
  },
  src: {
    html: `${source_folder}/*.html`,
    pug: `${source_folder}/pug/*.pug`,
    scss: `${source_folder}/scss/*.scss`,
    css: `${source_folder}/css/**/*.css`,
    js: `${source_folder}/js/*.js`,
    jsCopy: `${source_folder}/jsCopy/*.js`,
    img: `${source_folder}/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
    fonts: `${source_folder}/fonts/*.ttf`,
    libs: `${source_folder}/libs/**/*`,
    favicon: `${source_folder}/favicons/**/*.{png,ico}`,
    php: `${source_folder}/php/*.php`,
    audio: `${source_folder}/audio/*.{mp3,ogg}`,
    public: `${source_folder}/public/**/*`,
  },
  watch: {
    html: `${source_folder}/html/**/*.html`,
    pug: `${source_folder}/pug/**/*.pug`,
    scss: `${source_folder}/scss/**/*.scss`,
    js: `${source_folder}/js/**/*.js`,
    img: `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
    favicon: `${source_folder}/favicons/**/*.{png,ico}`,
    php: `${source_folder}/php/*.php`,
    audio: `${source_folder}/audio/*.{mp3,ogg}`,
    public: `${source_folder}/public/**/*`,
  },
  clean: project_folder,
};

/* Funcs */
function browserSyncStart() {
  bs.init({
    server: {
      baseDir: project_folder,
    },
    port: 3000,
    notify: false,
  });
}

function clearDist() {
  return deleteAsync(paths.clean);
}

function pugF() {
  return src(paths.src.pug)
    .pipe(pug({ pretty: true }))
    .pipe(dest(paths.build.html))
    .pipe(bs.stream());
}

function scssF() {
  return src(paths.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 3 versions"],
        cascade: true,
      }),
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest(paths.build.css))
    .pipe(bs.stream());
}

function js() {
  return src(paths.src.js)
    .pipe(fileinclude())
    .pipe(dest(paths.build.js))
    .pipe(bs.stream());
}

function copyCSS() {
  return src(paths.src.css).pipe(dest(paths.build.css));
}

function copyJS() {
  return src(paths.src.jsCopy).pipe(dest(paths.build.js));
}

function copyAudio() {
  return src(paths.src.audio, { encoding: false }).pipe(
    dest(paths.build.audio),
  );
}

function copyPublic() {
  return src(paths.src.public, { encoding: false }).pipe(
    dest(paths.build.public),
  );
}

function img() {
  return src(paths.src.img, { encoding: false }).pipe(dest(paths.build.img));
}

function favicon() {
  return src(paths.src.favicon, { encoding: false }).pipe(
    dest(paths.build.favicon),
  );
}

function fonts() {
  src(paths.src.fonts, { encoding: false })
    .pipe(ttf2woff())
    .pipe(dest(paths.build.fonts));
  return src(paths.src.fonts, { encoding: false })
    .pipe(ttf2woff2())
    .pipe(dest(paths.build.fonts));
}

function otf2ttf() {
  return src([`${source_folder}/fonts/*.otf`])
    .pipe(fonter({ formats: ["ttf"] }))
    .pipe(dest(`${source_folder}/fonts/`));
}

function php() {
  return src(paths.src.php).pipe(dest(paths.build.php));
}

function watchFiles() {
  watch(paths.watch.pug, pugF);
  watch(paths.watch.scss, scssF);
  watch(paths.watch.js, js);
  watch(paths.watch.img, img);
  watch(paths.watch.public, copyPublic);
  watch(paths.watch.php, php);
}

const build = series(
  clearDist,
  parallel(
    pugF,
    scssF,
    js,
    img,
    copyCSS,
    copyJS,
    favicon,
    php,
    fonts,
    copyAudio,
    copyPublic,
  ),
);

const dev = series(build, parallel(browserSyncStart, watchFiles));

export {
  build,
  copyAudio,
  copyCSS,
  copyJS,
  copyPublic,
  dev as default,
  favicon,
  fonts,
  img,
  otf2ttf,
  php,
  pugF
};
