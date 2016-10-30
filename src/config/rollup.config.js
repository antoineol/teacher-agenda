var commonjs = require('rollup-plugin-commonjs');
var firebase = require('firebase/package.json');
// import uglify from 'rollup-plugin-uglify';
var rollupConfig = require('../../node_modules/@ionic/app-scripts/config/rollup.config');


var plugins = rollupConfig.plugins;
var namedExports = {};
addFirebase(namedExports);

rollupConfig.useStrict = false;
plugins[commonjsPluginIndex(plugins)] = commonjs({
	include: [
		'node_modules/rxjs/**',
		'node_modules/angularfire2/**',
		'node_modules/firebase/**'
	],
	namedExports: namedExports
});
// plugins.push(uglify());

module.exports = rollupConfig;



function commonjsPluginIndex(plugins) {
	for (var i = 0, l = plugins.length; i < l; i++) {
		var plugin = plugins[i];
		if (plugin && plugin.name === 'commonjs') {
			return i;
		}
	}
}

function addFirebase(namedExports) {
	// Change for firebase >= 3.4
	// https://github.com/angular/angularfire2/blob/master/docs/aot-rollup-cli-setup.md#-34
	// As of angularfire2 beta 5, firebase@3.3 is used.
	if (firebase.version.substr(0, 3) === '3.3') {
		namedExports['node_modules/firebase/firebase-browser.js'] = ['initializeApp', 'auth', 'database'];
	} else {
		namedExports['node_modules/firebase/firebase.js'] = ['initializeApp', 'auth', 'database'];
	}
}
