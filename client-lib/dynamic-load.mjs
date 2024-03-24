import ibv from './image-browser-view.mjs';
import { FileSelectDialog as fsd } from './file-select-dialog.mjs'

import ls from './load-styles.mjs'



export let ImageBrowserView = ibv
export let FileSelectDialog = fsd
export let loadStyles = ls

if(typeof window !== 'undefined') {
	window['@webhandle/tree-file-browser'] = {
		ImageBrowserView
		, FileSelectDialog
		, loadStyles
	}
}
export default ImageBrowserView


