/* eslint-disable func-names */

/* REQUIRES */
const gulp = require('gulp');
const fs = require('fs');
// Helper libraries
const _ = require('lodash');
const child = require('child_process');
const del = require('del');
const glob = require('glob');
const gutil = require('gulp-util');
const path = require('path');
const util = require('util');
const runSequence = require('run-sequence');

// Linting
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');

// File I/O
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const notify = require('gulp-notify');
const nunjucks = require('gulp-nunjucks');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const inline = require('gulp-inline');
// const replace = require('gulp-replace');
const htmlreplace = require('gulp-html-replace');
// Browserify
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const watchify = require('watchify');
const streamify = require('gulp-streamify');
const browserify = require('browserify');
const aliasify = require('aliasify');
const rev = require('gulp-rev');
const wait = require('gulp-wait');

const globalShim = require('browserify-global-shim').configure({
  'jquery': '$'
});

/* FILE PATHS */
const paths = {
  html: {
    files: ['html/content/_app/index.html'],
    srcDir: '.',
    destDir: 'layouts'
  },

  layouts: {
    files: ['html/layouts/**/*.html'],
    srcDir: 'html/layouts',
    destDir: 'layouts'
  },

  js: {
    apps: 'js/apps/*.js',
    files: ['js/**/*.js'],
    srcDir: 'js',
    destDir: 'build/js'
  },

  js_global: {
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jquery-validation/dist/jquery.validate.js',
      'node_modules/js-cookie/src/js.cookie.js',
      'node_modules/featherlight/release/featherlight.min.js',
      'node_modules/nunjucks/browser/nunjucks-slim.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/toastr/toastr.js',
      'node_modules/typed.js/dist/typed.min.js',
      'node_modules/vivus/dist/vivus.min.js',
      'node_modules/downloadjs/download.min.js',
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/strength.js/src/strength.min.js'
    ],
    ie: [
      'node_modules/html5shiv/dist/html5shiv.min.js',
      'node_modules/respond.js/dest/respond.min.js'
    ],
    destDir: 'build/js_global'
  },

  templates: {
    files: ['templates/**/*.html'],
    srcDir: 'templates',
    destDir: 'build/templates'
  },

  scss: {
    files: ['scss/main.scss'],
    srcDir: 'scss',
    destDir: 'build/css'
  },

  css_ext: {
    files: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/bxslider/dist/jquery.bxslider.min.css',
      'node_modules/featherlight/release/featherlight.min.css',
      'node_modules/toastr/toastr.scss',
      'node_modules/slick-carousel/slick/slick.scss',
      // 'node_modules/slick-carousel/slick/slick-theme.scss'
    ]
  },

  images: {
    files: ['images/**/*'],
    srcDir: 'images',
    destDir: 'build/images'
  },

  media: {
    files: ['media/**/*'],
    srcDir: 'media',
    destDir: 'build/media'
  },

  static: {
    files: ['static/**/*'],
    srcDir: 'static',
    destDir: 'build'
  },

  api: {
    files: ['api/**/*'],
    srcDir: 'api',
    destDir: 'build/api'
  },

  fonts: {
    files: [
      'fonts/**/*',
      'node_modules/font-awesome/fonts/fontawesome-webfont.svg',
      'node_modules/font-awesome/fonts/FontAwesome.otf',
      'node_modules/font-awesome/fonts/fontawesome-webfont.eot',
      'node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
      'node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
      'node_modules/font-awesome/fonts/fontawesome-webfont.woff'
    ],
    srcDir: 'fonts',
    destDir: 'build/fonts'
  },

  json: {
    files: ['products.json'],
    srcDir: 'products.json',
    destDir: 'data/'
  }
};

/* TASKS */
/* Lints the CSS files */
gulp.task('lint:css', function() {
  gulp.src(paths.scss.files)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

/* Compiles SCSS files into CSS files and copies them to the distribution directory */
gulp.task('scss', function() {
  const scssStream = gulp.src(paths.scss.files)
    .pipe(sass({
      'outputStyle': 'compressed',
      'errLogToConsole': true
    }))
    .pipe(concat('scss-files.scss'));

  const cssextStream = gulp.src(paths.css_ext.files)
    .pipe(concat('css-ext-files.css'));

  return merge(scssStream, cssextStream)
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rev())
    .pipe(gulp.dest(paths.scss.destDir))
    .pipe(rev.manifest({
      base: 'build',
      merge: true
    }))
    .pipe(gulp.dest('build'));
});

/* Development css task */
gulp.task('css:dev', function() {
  runSequence(/*'lint:css',*/ 'scss');
});

/* Production css task */
gulp.task('css:prod', function(done) {
  runSequence(/*'lint:css',*/ 'scss', function(error) {
    done(error && error.err);
  });
});

/* Copies files to the distribution directory */
['images', 'fonts', 'api', 'static'].forEach(function(fileType) {
  gulp.task(fileType, function() {
    return gulp.src(paths[fileType].files)
      .pipe(gulp.dest(paths[fileType].destDir));
  });
});

/* Deletes the distribution directory */
gulp.task('clean', function() {
  return del(['build', 'public']);
});

function fixManifest(revman, key, d) {
  if (!revman[key]) {
    var index = key.indexOf('.');
    var prefix = key.substring(0, index) + '-';
    var suffix = key.substring(index);
    var aname, atime;
    if (fs.existsSync(d)) {
      fs.readdirSync(d).forEach(f => {
        if (f.startsWith(prefix) && f.endsWith(suffix)) {
          fi = fs.statSync(path.join(d, f));
          mtime = new Date(util.inspect(fi.mtime));
          if (aname) {
            if (mtime > atime) {
              aname = f;
              atime = mtime;
            }
          } else {
            aname = f;
            atime = mtime;
          }
        }
      });
    }
    revman[key] = aname;
  }
}

/* Copies the HTML file to the content directory (prod) */
gulp.task('html', function(done) {
  const ext = [];
  _.forEach(paths.js_global.files, (file) => {
    ext.push('/js_global/' + file.substring(file.lastIndexOf('/') + 1));
  });

  const ie = [];
  _.forEach(paths.js_global.ie, (file) => {
    ie.push('/js_global/' + file.substring(file.lastIndexOf('/') + 1));
  });

  let revman = {};
  if (fs.existsSync('./rev-manifest.json')) {
    revman = JSON.parse(fs.readFileSync('./rev-manifest.json', 'utf-8'));
  }
  fixManifest(revman, 'signin.app.js', './build/js');
  fixManifest(revman, 'signup.app.js', './build/js');
  fixManifest(revman, 'style.min.css', './build/css');
  fixManifest(revman, 'templates.min.js', './build/templates');

  var files = glob.sync(paths.js.apps);
  var tasks = [];
  _.each(files, function(file) {
    gulp.task('app:' + file, function() {
      const name = path.basename(file);
      const appName = name.substring(0, name.indexOf('.'));
      return gulp.src(paths.html.files[0])
        .pipe(htmlreplace({
          'js': '/js/' + revman[appName + '.app.js'],
          'js_global': ext,
          'js_ie': ie,
          'css': '/css/' + revman['style.min.css'],
          'templates': '/templates/' + revman['templates.min.js']
        }))
        .pipe(rename('single.html'))
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.html.destDir + '/' + appName));
    });
    tasks.push('app:' + file);
  });
  runSequence(tasks, done);
});

/* Copies the Hugo's layout HTML file to the layouts directory */
gulp.task('layouts', function() {
  const ext = [];
  _.forEach(paths.js_global.files, (file) => {
    ext.push('/js_global/' + file.substring(file.lastIndexOf('/') + 1));
  });

  const ie = [];
  _.forEach(paths.js_global.ie, (file) => {
    ie.push('/js_global/' + file.substring(file.lastIndexOf('/') + 1));
  });

  let revman = {};
  if (fs.existsSync('./rev-manifest.json')) {
    revman = JSON.parse(fs.readFileSync('./rev-manifest.json', 'utf-8'));
  }
  fixManifest(revman, 'style.min.css', './build/css');
  return gulp.src(paths.layouts.files)
    .pipe(htmlreplace({
      'js_global': ext,
      'js_ie': ie,
      'css': '/css/' + revman['style.min.css']
    }))
    // .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(paths.layouts.destDir));
});

gulp.task('templates', function() {
  return gulp.src(paths.templates.files)
    .pipe(nunjucks())
    .pipe(concat('templates.min.js'))
    .pipe(streamify(uglify()))
    .pipe(rev())
    .pipe(gulp.dest(paths.templates.destDir))
    .pipe(rev.manifest({
      base: 'build',
      merge: true // merge with the existing manifest if one exists
    }))
    .pipe(gulp.dest('build'));
});

/* Lints the JS files */
gulp.task('lint:js', function() {
  return gulp.src(paths.js.files)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/* Helper which bundles the JS files and copies the bundle into the distribution file (dev) */
function bundle(b, name) {
  return b
    .bundle()
    .pipe(source(name))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .on('error', function(error) {
      gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
    })
    .pipe(rev())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.js.destDir))
    .pipe(rev.manifest({
      base: 'build',
      merge: true
    }))
    .pipe(gulp.dest('build'));
}

/* Browserifies the JS files and copies the bundle into the distribution file (dev) */
gulp.task('js:dev', function(done) {
  var files = glob.sync(paths.js.apps);
  var tasks = [];
  _.each(files, function(file) {
    gulp.task(file + ':dev', function() {
      const name = path.basename(file);
      const b = browserify({
        plugin: [watchify],
        cache: {},
        debug: true,
        fullPaths: true,
        packageCache: {}
      })
        .transform(aliasify, {
          aliases: {
            'underscore': 'lodash'
          },
          verbose: true,
          global: true
        })
        .transform(babelify, {
          presets: ['es2015']
        })
        .transform(globalShim)
        .add(file);

      // Re-bundle the distribution file every time a source JS file changes
      b.on('update', function() {
        gutil.log('Re-bundling distribution files');
        bundle(b, name);
      });

      // Log a message and reload the browser once the bundling is complete
      b.on('log', function(message) {
        gutil.log('Distribution files re-bundled:', message);
        runSequence('lint:js', 'html', 'layouts', 'trigger-hugo');
      });
      return bundle(b, name);
    });
    tasks.push(file + ':dev');
  });
  tasks.push(done);
  runSequence.apply(null, tasks);
});

/* Browserifies the JS files and copies the bundle into the distribution file (prod) */
gulp.task('js:prod', function(done) {
  runSequence('lint:js', 'browserify:js', function(error) {
    done(error && error.err);
  });
});

/* Replaces image and link absolute paths with the correct production path */
gulp.task('copy:js_global', function() {
  return gulp.src([].concat(paths.js_global.files, paths.js_global.ie))
    .pipe(gulp.dest(paths.js_global.destDir));
});

/* Copies files to the distribution directory */
['images', 'fonts', 'api', 'json'].forEach(function(fileType) {
  gulp.task(fileType, function() {
    return gulp.src(paths[fileType].files)
      .pipe(gulp.dest(paths[fileType].destDir));
  });
});

/* Browserifies the JS files into a single bundle file */
gulp.task('browserify:js', function(done) {
  var files = glob.sync(paths.js.apps);
  var tasks = [];
  _.each(files, function(file) {
    gulp.task(file + ':prod', function() {
      const name = path.basename(file);
      return browserify()
        .transform(aliasify, {
          aliases: {
            'underscore': 'lodash'
          },
          verbose: true,
          global: true
        })
        .transform(babelify, {
          presets: ['es2015']
        })
        .transform(globalShim)
        .add(file)
        .bundle()
        .on('error', function(error) {
          gutil.log(gutil.colors.red('Error bundling distribution files:'), error.message);
          process.exit(1);
        })
        .pipe(source(name))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(streamify(uglify()))
        .pipe(rev())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.js.destDir))
        .pipe(rev.manifest({
          base: 'build',
          merge: true
        }))
        .pipe(gulp.dest('build'));
    });
    tasks.push(file + ':prod');
  });
  tasks.push(done);
  runSequence.apply(null, tasks);
});

/* Copy media files to production directory */
gulp.task('copy:media', function() {
  return gulp
    .src(paths.media.files)
    .pipe(gulp.dest(paths.media.destDir));
});

/* Watches for file changes (JS file changes are watched elsewhere via watchify) */
gulp.task('watch', function() {
  const fileTypesToWatch = {
    scss: ['css:dev', 'html', 'layouts', 'trigger-hugo'],
    html: ['html'],
    layouts: ['layouts'],
    fonts: ['fonts'],
    images: ['images'],
    api: ['api'],
    templates: ['templates', 'html', 'trigger-hugo']
  };

  _.forEach(fileTypesToWatch, function(taskToRun, fileType) {
    gulp.watch(paths[fileType].files, function() {
      runSequence.apply(this, taskToRun);
    });
  });
});

/* Replaces image and link absolute paths with the correct production path */
gulp.task('trigger-hugo', function() {
  return gulp.src(['rev-manifest.json'])
    .pipe(wait(1000))
    .pipe(gulp.dest('build'));
});

/* Build hugo contents */
gulp.task('hugo:prod', function() {
  const cmd = child.spawnSync('hugo', ['-v', '--config=config.yaml']);
  if (cmd.stderr.length) {
    const lines = cmd.stderr.toString()
      .split('\n')
      .filter(function(line) {
        return line.length;
      });
    for (const line of lines) {
      gutil.log(gutil.colors.red('Error [hugo:prod]: ' + line));
    }
    notify({
      title: 'Error (go install)',
      message: lines
    });
  }
  return cmd;
});

/* Build hugo contents */
gulp.task('hugo:dev', function() {
  const cmd = child.spawnSync('hugo', ['-v', '--buildDrafts', '--config=config.yaml']);
  if (cmd.stderr.length) {
    const lines = cmd.stderr.toString()
      .split('\n')
      .filter(function(line) {
        return line.length;
      });
    for (const line of lines) {
      gutil.log(gutil.colors.red('Error [hugo:prod]: ' + line));
    }
    notify({
      title: 'Error (go install)',
      message: lines
    });
  }
  return cmd;
});

gulp.task('svg', function() {
  return gulp.src('public/products/**/index.html')
    .pipe(inline({
      base: 'public/',
      disabledTypes: ['css', 'img', 'js'], // Only inline svg files
      ignore: [
        // '/images/safari-pinned-tab.svg',
        // '/images/logo.svg',
        // '/images/logo-color.svg',
        // '/images/products/header.svg',
        // '/images/products/attic/attic.svg',
        // '/images/products/attic/dashboard.svg',
        // '/images/products/attic/seamless.svg',
        // '/images/products/deployment/docker_kubernetes.svg',
        // '/images/products/deployment/multi-cloud.svg',
        // '/images/products/what-is-appscode.svg',
        // '/images/products/logging-monitoring/grafana.svg'
      ]
    }))
    .pipe(gulp.dest('public/products/'));
});

/*
 * Restart application server.
 */
var hugo = null;
gulp.task('hugo:serve', function() {
  if (hugo) {
    hugo.kill();
  }

  /* Spawn application hugo */
  hugo = child.spawn('hugo', ['-v', 'server', '--watch', '--buildDrafts', '--config=config.yaml']);

  /* Pretty print hugo log output */
  hugo.stdout.on('data', function(data) {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.length) {
        gutil.log(line);
      }
    }
  });

  /* Print errors to stdout */
  hugo.stderr.on('data', function(data) {
    process.stdout.write(data.toString());
  });
});

/* Copies files to the distribution directory */
['dev', 'prod'].forEach(function(env) {
  gulp.task(env, function(done) {
    // Stop using firebase-tools directly until https://github.com/firebase/firebase-tools/issues/136
    runSequence('clean', 'templates', 'css:prod', 'copy:media', ['js:prod', 'copy:js_global', 'images', 'fonts', 'api', 'json', 'static'], 'html', 'layouts', 'hugo:' + env, function(error) {
      done(error && error.err);
    });
  });
});

// local
gulp.task('default', function(done) {
  runSequence('clean', 'templates', 'copy:js_global', 'copy:media', ['css:dev', 'images', 'fonts', 'api', 'json', 'static'], 'js:dev', 'html', 'layouts', 'watch', 'hugo:serve', function(error) {
    done(error && error.err);
  });
});
