import sinkSetup from './sink-setup.mjs'
sinkSetup()

import resizeImage from '../client-lib/image-resize.mjs'
import dataToImage from '../client-lib/data-to-image.mjs'
import getImageStats from '../client-lib/get-image-stats.mjs'
import makeImageSet from '../client-lib/make-image-set.mjs'

import ImageBrowserView from '../client-lib/image-browser-view.mjs'
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

	// eventPanel.addNotification({
	// 	model: {
	// 		status: 'success',
	// 		headline: 'Page started'
	// 	}
	// })
	
	imageBrowserView.emitter.on('select', function(evt) {

		console.log(evt)
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




