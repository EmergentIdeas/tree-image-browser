# Webhandle / Tree Image Browser

Mostly client side html/css/js components to browse, select, upload, and delete files
on a server from a browser. It uses the [File Sink](https://www.npmjs.com/package/file-sink)
family of packages to provide access to server files.


## Install

```bash
npm install @webhandle/tree-file-browser
```

## Usage

This package can be used either as something built into a single page app or as a piece of
code loaded on demand. 

### Single page app

Set up a file manager

```js
import { ImageBrowserView, FileSelectDialog, loadStyles  } from '@webhandle/tree-file-browser/client-lib/dynamic-load.mjs'

let treeHolder = document.querySelector('.webhandle-file-tree-image-browser')
if(treeHolder) {
	loadStyles()
	let imageBrowserView = new ImageBrowserView({
		// The source of the files
		sink: the file sink
		// optional, an panel to post events
		, eventNotificationPanel: eventPanel
		// optional, the directory which to open to
		, startingDirectory: 'img/empty'
	})
	imageBrowserView.appendTo(treeHolder)
	imageBrowserView.render()
}

```

`loadStyles` causes css to be added to the page which support the browser. Different setups are possible,
but by default, the styles expect the content to be a child of an element with a class `webhandle-file-tree-image-browser`.
Alternatively, the styles can be built into the pages stylesheet by including the file 
`@webhandle/tree-file-browser/less/components.less`. `loadStyles` attempts to determine if the css is already in place,
so there's no harm in calling it if the css has already been included.

Loading the css dynamically or loading the file browser dynamically requires that the compiled resources have been added to
files available to the browser. These are at `@webhandle/tree-file-browser/resources` and must be available at the url
`/@webhandle/tree-file-browser/resources`

If you're using webhandle, you can set up all the server side resources, including kapla-tree-on-page and the material icons,
by using:

```js
import webhandle from "webhandle"
import initializeTreeBrowserResources from "@webhandle/tree-file-browser/server-lib/initialize-tree-browser-resources.mjs"
initializeTreeBrowserResources(webhandle)
```

or the equivalent common js include:

```js
const webhandle = require('webhandle')
const initializeTreeBrowserResources = require("@webhandle/tree-file-browser/server-lib/initialize-tree-browser-resources.cjs")
initializeTreeBrowserResources(webhandle)
```

This code can also be used as a file selection dialog like:

```js
import { ImageBrowserView, FileSelectDialog, loadStyles  } from '@webhandle/tree-file-browser/client-lib/dynamic-load.mjs'
let selectButton = document.querySelector('.select-image')
if(selectButton) {
	selectButton.addEventListener('click', async function(evt) {
		evt.preventDefault()
		let diag = new FileSelectDialog({
			sink: the-file-sink
			, startingDirectory: 'img'
			, imagesOnly: true
		})
		let result = await diag.open()
		console.log(result)
	})
}

```


### Dynmaically load

Using it independently on a single page is also pretty easy

```html
	<script type="module">
		import { ImageBrowserView, loadStyles } from '/@webhandle/tree-file-browser/resources/js/tree-file-browser.js'
		loadStyles()

		let treeHolder = document.querySelector('.webhandle-file-tree-image-browser')
		if(treeHolder) {
			let imageBrowserView = new ImageBrowserView({
				sink: the-file-sink
				, startingDirectory: 'img'
			})
			imageBrowserView.appendTo(treeHolder)
			imageBrowserView.render()
			
			imageBrowserView.emitter.on('select', async function(evt) {
				console.log(await imageBrowserView.getSelectedUrl())
			})
		}
	</script>

```

### Selections

You can listen for selections like:

```js
	imageBrowserView.emitter.on('select', async function(evt) {
		console.log(await imageBrowserView.getSelectedUrl())
	})
```

### Options

```js
	/**
	 * Construct a new file browser
	 * @param {object} options 
	 * @param {FileSink} options.sink The file to use as a file source
	 * @param {boolean} [options.imagesOnly] Set to true if you would like to display only images
	 * @param {boolean} [options.allowFileSelection] Set to true so that selected files are marked
	 * @param {EventNotificationPanel} [options.eventNotificationPanel] The panel which status messages will be added to.
	 * @param {string} [options.startingDirectory] Opens to that directory path if it exists
	 * @param {boolean} [options.deleteWithoutConfirm] False by default
	 * @param {boolean} [options.ignoreGlobalEvents] False by default, if true it will not listen to events like paste or keypresses
	 * which occur on the document
	 * @param {Emitter} [options.emitter] Emitter for various file events
	 */

```
