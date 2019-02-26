'use strict';

//  Load plugins

var gulp = require('gulp'), 
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),    
    runSequence = require('run-sequence'),
    connect = require('gulp-connect'),
    del = require('del'),
    size = require('gulp-size'),
    gulpif = require('gulp-if'),
    argv = require('yargs').argv,
    csso = require('gulp-csso'),
    sass = require('gulp-sass'),
    sassVariables = require('gulp-sass-variables') ;


//Handle possible memory leaks in javascript, probably irrelevant now

var events = require('events').EventEmitter.prototype._maxListeners = 100;

// Check for --dev flag

var isDev = !!(argv.dev);

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
    
    dest: './views',
    destConsumerCSSLocal: './public/stylesheets',
    destJavaScript: './public/javascripts',
    destImages: './public/images',
    destSounds: './public/sounds',
    destFonts: './public/fonts'
};

//Compile and minify scss => css

gulp.task('consumerstyles', function () {

    return gulp.src([
                    paths.consumerScss + '/*.scss',
                    paths.consumerScss + '/!_*.scss'
                ])
        .pipe(gulpif(!isDev,
                    sassVariables({
                        $env: 'production'
                    }),
                    sassVariables({
                        $env: 'development'
                    })
        ))
        .pipe(gulpif(!isDev,
                    sass({
                        outputStyle: "nested"
                    }).on('error', sass.logError),
                    sass({
                        outputStyle: 'expanded'
                    }).on('error', sass.logError)
        ))
        .pipe(gulpif(!isDev, csso()))
        .pipe(gulpif(!isDev, 
             gulp.dest(paths.destConsumerCSSLocal)))
        .pipe(size({
            title: 'Consumer CSS'
        }))
        .pipe(connect.reload())
});

//Concat and minify javascript files

gulp.task('mainJS', function () {
    return gulp.src([
                    paths.scripts + 'blastradius/*.js'
                ])
        .pipe(concat('scripts.js'))
        .pipe(gulpif(!isDev, rename({
            suffix: '.min'
        })))
        .pipe(gulpif(!isDev, uglify()))
        .pipe(gulp.dest(paths.destJavaScript))
        .pipe(size({
            title: 'Main JS'
        }))
        .pipe(connect.reload());
});

gulp.task('vendors', function () {
    return gulp.src([paths.scripts + 'vendor/*.js'
                ])
        .pipe(gulpif(!isDev, rename({
            suffix: '.min'
        })))
        .pipe(gulpif(!isDev, uglify()))
        .pipe(gulp.dest(paths.destJavaScript))
        .pipe(size({
            title: 'Vendor JS'
        }))
        .pipe(connect.reload());
});

//Run all script tasks

gulp.task('scripts', function () {
    runSequence(
        ['mainJS'], 
        'vendors');
});

//Run all SCSS => CSS tasks

gulp.task('styles', function () {
    runSequence('consumerstyles');
});

//Copy images for local work, could do some image optimization here in the future

gulp.task('images', function () {
    return gulp.src(paths.images + '/**/*.{png,jpg,jpeg,gif,svg,ico}')
        .pipe(gulp.dest(paths.destImages))
        .pipe(connect.reload());
});
gulp.task('sounds', function () {
    return gulp.src(paths.sounds + '/**/*.wav')
        .pipe(gulp.dest(paths.destSounds))
        .pipe(connect.reload());
});

//Compile HTML templates

gulp.task('compileHTML', function () {
    gulp.src(paths.html + '/**/*.hbs')
        .pipe(gulp.dest(paths.dest))
        .pipe(connect.reload());
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
        paths.dest + '/**/*.*'
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
