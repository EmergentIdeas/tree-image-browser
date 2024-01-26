import sinkSetup from './sink-setup.mjs'
sinkSetup()

import ImageBrowserView from './image-browser-view.mjs'
import {setup as panelSetup} from '@webhandle/event-notification-panel'
let eventPanel = panelSetup({
	notificationHolder: '#event-notifications' /* Optional. The selector of the element to which the
												  panel should be added. */
})


let imageBrowserView = new ImageBrowserView({
	sink: webhandle.sinks.files
	// , imagesOnly: true
	, eventNotificationPanel: eventPanel
	, startingDirectory: 'test2'
})
imageBrowserView.appendTo(document.querySelector('.webhandle-file-tree-image-browser'))
imageBrowserView.render()

// eventPanel.addNotification({
// 	model: {
// 		status: 'success',
// 		headline: 'Page started'
// 	}
// })


