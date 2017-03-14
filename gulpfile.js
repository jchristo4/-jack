// Include gulp
var gulp = require('gulp');

// Include our plugins
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

// JS Lint task
gulp.task('es-lint', function() {
  return gulp.src([
    'js/*.js'
  ])
  .pipe(eslint({
    parserOptions: {
      'ecmaVersion': 6
    },
    extends: 'eslint:recommended',
    rules: {
      'quotes': [1, 'single'],
      'semi': [1, 'always'],
      'strict': [2, 'global']
    },
    envs: [
      'browser'
    ]
  }))
  .pipe(eslint.format())
  // Brick on failure to be super strict
  .pipe(eslint.failOnError());
});


// Concatenate & minify JS
gulp.task('js-src', function() {

  gulp.src([
      'js/blackjack.js',
      'js/eventsEmitter.js',
      'js/ui.js',
      'js/player.js',
      'js/deck.js',
      'js/app.js'
    ])
    .pipe(concat('all-src.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename('all-src.min.js'))
    .pipe(gulp.dest('dist'))
    .on('error', console.log.bind(console));

  gulp.src([
    'dist/all-src.min.js'
  ])
  .pipe(concat('all.min.js'))
  .pipe(gulp.dest('dist'))
  .on('error', console.log.bind(console));
});


// Concatenate & minify CSS
gulp.task('css', function() {
  gulp.src([
      'css/*.css'
    ])
    .pipe(concat('all.css'))
    .on('error', console.log.bind(console))
    .pipe(gulp.dest('dist'));
});


// watch files for changes
gulp.task('watch', function() {
  gulp.watch('*.html');
  gulp.watch('js/**/*.js', ['es-lint', 'js-src']);
  gulp.watch(['css/*css'], ['css']);
});

// default task
gulp.task('default', ['es-lint', 'js-src', 'css']);
