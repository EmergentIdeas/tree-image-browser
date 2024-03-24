import path from "path"
let initialized = false

import kalpaTreeOnPage from 'kalpa-tree-on-page'
import iconResources from '@dankolz/webhandle-admin-icons'


export default function initializeTreeBrowserResources(webhandle) {
	if(!initialized) {
		initialized = true
		kalpaTreeOnPage(webhandle)
		iconResources(webhandle)
		webhandle.addStaticDir(path.join(webhandle.projectRoot, 'node_modules/@webhandle/tree-file-browser/public/tree-file-browser'), {urlPrefix: '/@webhandle/tree-file-browser'})
	}
}
