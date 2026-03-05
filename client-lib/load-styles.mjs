import areStylesLoaded from "./styles-loaded.mjs";
import { loadMaterialIcons } from "@webhandle/material-icons"

export default function loadStyles() {
	if (!areStylesLoaded()) {
		let link = document.createElement('link')
		link.href = '/@webhandle/tree-file-browser/files/css/tree-browser.css'
		link.rel = 'stylesheet'
		document.head.appendChild(link)

	}
	loadMaterialIcons()

	let sheetUrls = [...document.styleSheets].map(sheet => sheet.href)
	if (!sheetUrls.some(url => url.includes('ei-form-styles.css'))) {
		let link = document.createElement('link')
		link.href = '/ei-form-styles-1/ei-form-styles.css'
		link.rel = 'stylesheet'
		document.head.appendChild(link)

	}

}