'use strict';
//  Load plugins
var gulp = require('gulp'), 
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),    
    runSequence = require('run-sequence'),
    del = require('del'),
    csso = require('gulp-csso'),
    sass = require('gulp-sass');

//Paths to source files
var paths = {
    //Consumer and global assets
    html: './src',
    consumerScss: './src/assets/scss',
    fonts: './src/assets/fonts',
    images: './src/assets/img',
    sounds: './src/assets/sound',
    scripts: './src/assets/js/',
   
    //Output Variables    
    destHtml: './views',
    dest: './public',
    destConsumerCSSLocal: './public/stylesheets',
    destJavaScript: './public/javascripts',
    destImages: './public/images',
    destSounds: './public/sounds'
};

//Compile and minify scss => css
gulp.task('consumerstyles', function () {
    return gulp.src([
                    paths.consumerScss + '/*.scss',
                    paths.consumerScss + '/!_*.scss'
                ])       
        .pipe(sass({
                    outputStyle: 'expanded'
                }).on('error', sass.logError)
        )
        .pipe(csso())
        .pipe(gulp.dest(paths.destConsumerCSSLocal));
});

//Run all SCSS => CSS tasks
gulp.task('styles', function () {
    runSequence('consumerstyles');
});

//Concat and minify javascript files
gulp.task('mainJS', function () {
    return gulp.src([
                    paths.scripts + 'blastradius/*.js'
                ])
        .pipe(concat('scripts.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.destJavaScript));
});

gulp.task('vendors', function () {
    return gulp.src([paths.scripts + 'vendor/*.js'
                ])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.destJavaScript));
});

//Run all script tasks
gulp.task('scripts', function () {
    runSequence(
        ['mainJS'], 
        'vendors');
});

//Copy images for local work, could do some image optimization here in the future
gulp.task('images', function () {
    return gulp.src(paths.images + '/**/*.{png,jpg,jpeg,gif,svg,ico}')
        .pipe(gulp.dest(paths.destImages));
});
gulp.task('sounds', function () {
    return gulp.src(paths.sounds + '/**/*.wav')
        .pipe(gulp.dest(paths.destSounds));
});

//Compile HTML templates
gulp.task('compileHTML', function () {
    gulp.src(paths.html + '/**/*.hbs')
        .pipe(gulp.dest(paths.destHtml));
});

//Watch task
gulp.task('watch', function () {
    //livereload.listen(); - uncomment to enable live reload
    gulp.watch(paths.consumerScss + '/**/*.scss', ['styles']);
    gulp.watch(paths.scripts + '/**/*.js', ['scripts']);
    gulp.watch(paths.html + '/**/*.hbs', ['compileHTML']);
    gulp.watch(paths.images + '/**/*.{png,jpg,jpeg,gif,svg}', ['images']);
    gulp.watch(paths.sounds + '/**/*.{wav}', ['sounds']);
});

//Clean dist directory
gulp.task('clean', function () {
    return del([
        paths.destHtml,paths.dest
    ], {
        force: true
    }).then(paths => {
        console.log('Cleaned dist directory');
    });
});

//Default task
gulp.task('default', ['clean'], function () {
    runSequence(
        ['images', 'scripts', 'styles', 'compileHTML','sounds'],
     'watch'
    );    
});
