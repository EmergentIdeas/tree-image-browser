import UploadableImage from 'ei-pic-browser/uploadable-image.js'
import sinkSetup from './sink-setup.mjs'
sinkSetup()

import { ImageBrowserView, FileSelectDialog, loadStyles  } from '../client-lib/dynamic-load.mjs'

import {setup as panelSetup} from '@webhandle/event-notification-panel'
let eventPanel = panelSetup({
	notificationHolder: '#event-notifications' /* Optional. The selector of the element to which the
												  panel should be added. */
})

let treeHolder = document.querySelector('.webhandle-file-tree-image-browser')
if(treeHolder) {
	let imageBrowserView = new ImageBrowserView({
		sink: webhandle.sinks.files
		// , imagesOnly: true
		, eventNotificationPanel: eventPanel
		, startingDirectory: 'img/empty'
		// , deleteWithoutConfirm: true
	})
	imageBrowserView.appendTo(treeHolder)
	imageBrowserView.render()

	
	imageBrowserView.emitter.on('select', async function(evt) {
		console.log(await imageBrowserView.getSelectedUrl())
	})
}


let selectButton = document.querySelector('.select-image')
if(selectButton) {
	selectButton.addEventListener('click', async function(evt) {
		evt.preventDefault()
		
		let diag = new FileSelectDialog({
			sink: webhandle.sinks.files
			, startingDirectory: 'img/empty'
			, imagesOnly: true
		})
		let result = await diag.open()
		console.log(result)
		
	})
	
	
}

let imagesInInput = document.querySelectorAll('input.picture-input-field')
for(let input of imagesInInput) {
	new UploadableImage(input)

}


