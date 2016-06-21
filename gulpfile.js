var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;
var path = require('path');
var appcache = require('gulp-appcache');

var isRelease = argv.indexOf('--release') > -1;

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

gulp.task('watch', ['clean'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({ watch: true }).on('end', done);
    }
  );
});

gulp.task('build', ['clean', 'icons'], function (done) {
	runSequence(
		'clean',
		['sass', 'html', 'fonts', 'scripts', 'icons'],
		'cache',
		function () {
			buildBrowserify({
				minify: true,
				uglifyOptions: {
					mangle: false
				},
				browserifyOptions: {
					debug: false/*!isRelease*/
				}
			}).on('end', done);
		}
	);
});
gulp.task('sass', function() {
	return buildSass({sassOptions: {
		includePaths: [
			'node_modules/ionic-angular',
			'node_modules/ionicons/dist/scss'
		],
		importer: npmModule
	}});
});
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  return del(['www/build', 'www/my.appcache']);
});



gulp.task('icons', function() {
	return gulp.src('resources/**/*')
		.pipe(gulp.dest('www/resources'));
});
gulp.task('cache', function() {
	gulp.src(['www/**/*'])
		.pipe(appcache({
			// relativePath: '/resources/build',
			// hash: true,
			// preferOnline: true,
			// network: ['http://*', 'https://*', '*'],
			timestamp: true,
			filename: 'my.appcache',
			exclude: ['stub', 'my.appcache', 'resources', 'index.html', 'build/css', 'build/js/app.bundle.js.map']
		}))
		.pipe(gulp.dest('www'));
});


// Inspired by http://stackoverflow.com/a/29924381/4717408
var aliases = {};
/**
 * Will look for .scss|sass files inside the node_modules folder
 */
function npmModule(url, file, done) {
	if (url.charAt(0) !== '~') {
		return done({file: url});
	}
	url = url.substring(1);
	// check if the path was already found and cached
	if (aliases[url]) {
		return done({file: aliases[url]});
	}

	// look for modules installed through npm
	try {
		var newPath = path.relative(path.dirname(file), resolveNpmSass(url));
		aliases[url] = newPath; // cache this request
		return done({file: newPath});
	} catch (e) {
		console.warn("Import from node_modules failed, probably not found:", url, " - in file:", file);
		// if your module could not be found, just return the original url
		aliases[url] = url;
		return done({file: url});
	}
}

function resolveNpmSass(url) {
	try {
		return require.resolve(url);
	} catch(e) {
		return require.resolve(url + '.scss');
	}
}
