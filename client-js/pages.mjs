import sinkSetup from './sink-setup.mjs'
sinkSetup()

import ImageBrowserView from './image-browser-view.mjs'


let imageBrowserView = new ImageBrowserView({
	sink: webhandle.sinks.files
	// , imagesOnly: true
})
imageBrowserView.appendTo(document.querySelector('.webhandle-file-tree-image-browser'))
imageBrowserView.render()
