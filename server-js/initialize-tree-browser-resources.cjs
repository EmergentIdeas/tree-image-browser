const path = require('path')
let initialized = false

const kalpaTreeOnPage = require('kalpa-tree-on-page')
const iconResources = require('@dankolz/webhandle-admin-icons')


function initializeTreeBrowserResources(webhandle) {
	if(!initialized) {
		initialized = true
		kalpaTreeOnPage(webhandle)
		iconResources(webhandle)
		webhandle.addStaticDir(path.join(webhandle.projectRoot, 'public/tree-file-browser'), {urlPrefix: '/@webhandle/tree-file-browser'})
	}
}

module.exports = initializeTreeBrowserResources