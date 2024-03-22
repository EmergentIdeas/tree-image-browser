import sinkSetup from './sink-setup.mjs'
sinkSetup()

import resizeImage from '../client-lib/image-resize.mjs'
import dataToImage from '../client-lib/data-to-image.mjs'
import getImageStats from '../client-lib/get-image-stats.mjs'
import makeImageSet from '../client-lib/make-image-set.mjs'
import areStylesLoaded from '../client-lib/styles-loaded.mjs'

import ImageBrowserView from '../client-lib/image-browser-view.mjs'

import { FileSelectDialog } from '../client-lib/file-select-dialog.mjs'

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
		, startingDirectory: 'empty'
		// , deleteWithoutConfirm: true
	})
	imageBrowserView.appendTo(treeHolder)
	imageBrowserView.render()

	
	imageBrowserView.emitter.on('select', async function(evt) {

		console.log(await imageBrowserView.getSelectedUrl())
	})
	
}


let imageHolder = document.querySelector('.image-holder')
if(imageHolder) {
	async function run() {
		let sink = webhandle.sinks.files
		let data = await sink.read('test2/4cats.jpg')
		let stats = await getImageStats(data)
		

		/*
		let resizedData = await resizeImage(data, {maxWidth: 100, outputFormat: 'image/jpeg'})
		let img = await dataToImage(resizedData)
		imageHolder.appendChild(img)
		sink.write('test2/resized.jpg', resizedData)
		*/
		let files = await makeImageSet(data, {
			baseFileName: 'test3'
			, outputFormat: 'image/jpeg'
		})
		for(let fileName of Object.keys(files)) {
			await sink.write('test2/' + fileName, files[fileName])
		}

	}
	run()
}


let selectButton = document.querySelector('.select-image')
if(selectButton) {
	selectButton.addEventListener('click', async function(evt) {
		evt.preventDefault()
		
		let diag = new FileSelectDialog({
			sink: webhandle.sinks.files
			, startingDirectory: 'img'
			, imagesOnly: true
		})
		let result = await diag.open()
		console.log(result)
		
	})
}


