const path = require('path');
module.exports = [
	
 {
	entry: './client-lib/index.mjs',
	mode: 'production',
	"devtool": 'source-map',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'browser.js',
		path: path.resolve(__dirname, 'public/tree-file-browser/resources/js'),
		library: {
			type: 'module',
		}
	},
	module: {
		rules: [
			{
				test: /\.txt$/i,
				use: '@webhandle/webpack-text-loader',
			}
			, {
				test: /\.tri$/i,
				use: '@webhandle/webpack-text-loader',
			}
		],
	},
	plugins: [
	],
	stats: {
		colors: true,
		reasons: true
	}
	, externals: {
		"@webhandle/backbone-view": '@webhandle/backbone-view'
		, "@webhandle/dialog": '@webhandle/dialog'
		, "@webhandle/material-icons": '@webhandle/material-icons'
		, "kalpa-tree-on-page/kalpa-tree-view": "kalpa-tree-on-page/kalpa-tree-view"
		, "tripartite": "tripartite"
	}
}


]