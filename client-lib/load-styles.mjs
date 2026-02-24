import areStylesLoaded from "./styles-loaded.mjs";
import {loadMaterialIcons} from "@webhandle/material-icons"

export default function loadStyles() {
	if(!areStylesLoaded()) {
		let link = document.createElement('link')
		link.href = '/@webhandle/tree-file-browser/files/css/tree-browser.css'
		link.rel = 'stylesheet'
		document.head.appendChild(link)
		
	}
	loadMaterialIcons()

}