var gulp = require('gulp'),
	tsc = require('gulp-typescript'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	typedoc = require('gulp-typedoc'),
	del = require('del');

gulp.task('doc', function(){
   return gulp.src( [ './ts/flashAirTypes.ts', './ts/flashAirClient.ts'] )
        .pipe(typedoc({
            module: "commonjs",
            out: "./doc",
            name: "FlashAir Javascript client library",
            target: "es3",
            includeDeclarations: false,
            excludeExternals: true,
            mode: "modules",
            gaID: "UA-3174161-2"
        })); 
});

gulp.task('js', function(){
	return gulp.src('./ts/**/*.ts')
		.pipe( sourcemaps.init())
		.pipe( tsc( new tsc.createProject({
			target: 'ES3',
			out: 'flashAirClient.js'
		})))
		.js
		.pipe( gulp.dest('./js'))
		.pipe( uglify({ preserveComments: 'some'}))
		.pipe( rename({ extname: '.min.js'}))
		.pipe( sourcemaps.write("."))
		.pipe( gulp.dest('./js'));
});

gulp.task('clean', function(){
	del(['doc','typings','node_modules','js']);
})

gulp.task('default', ['js','doc'] );