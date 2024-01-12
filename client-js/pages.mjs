import sinkSetup from './sink-setup.mjs'
sinkSetup()
// import {default as go} from './index.js'
// go()

import ImageBrowserView from './image-browser-view.mjs'


let imageBrowserView = new ImageBrowserView({
	sink: webhandle.sinks.files
})
imageBrowserView.appendTo(document.querySelector('.webhandle-file-tree-image-browser'))
imageBrowserView.render()
