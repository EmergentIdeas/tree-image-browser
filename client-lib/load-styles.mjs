import areStylesLoaded from "./styles-loaded.mjs";
import ensureIcons from '@dankolz/webhandle-admin-icons/client-js/ensure-styles-are-loaded.js'

export default function loadStyles() {
	if(!areStylesLoaded()) {
		let link = document.createElement('link')
		link.href = '/@webhandle/tree-file-browser/resources/css/tree-browser.css'
		link.rel = 'stylesheet'
		document.head.appendChild(link)
		
	}
	ensureIcons()

}