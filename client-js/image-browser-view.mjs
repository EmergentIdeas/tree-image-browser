import { View } from '@webhandle/backbone-view'
import { imageBrowserFrame, variantChoiceBox } from '../views/load-browser-views.js'
import KalpaTreeOnPage from 'kalpa-tree-on-page'
import condense from '@dankolz/webp-detection/lib/condense-image-variants.js'
import basename from '@dankolz/webp-detection/lib/file-basename.js'
// import Dialog from 'ei-dialog'
import { FormAnswerDialog } from './form-answer-dialog.mjs'
import { InfoDialog } from './info-dialog.mjs'
import formatBytes from './format-bytes.mjs'

export default class ImageBrowserView extends View {
	
	/**
	 * Construct a new file browser
	 * @param {object} options 
	 * @param {FileSink} options.sink The file to use as a file source
	 * @param {boolean} options.imagesOnly Set to true if you would like to display only images
	 * @param {boolean} options.allowFileSelection Set to true so that selected files are marked
	 */
	constructor(options) {
		super(options)
	}
	preinitialize() {
		this.className = 'image-browser'
		this.idInd = 1
		this.nodes = {}
		this.events = {
			'click .create-directory': 'createDirectory'
			, 'click .variant-choice-box .details': 'showVariantDetails'
			, 'click .variant-choice-box': 'selectVariant'
		}
	}

	selectVariant(evt, selected) {
		let currentSelected = this.el.querySelectorAll('.choice-boxes .variant-choice-box.selected')
		for(let sel of currentSelected) {
			sel.classList.remove('selected')
		}

		selected.classList.add('selected')
	}

	createDirectory(evt, selected) {
		let dialog = new FormAnswerDialog({
			title: 'Create Directory'
			, body: '<label>Directory name <input type="text" name="name" /></label>'
		})
		let prom = dialog.open()
		prom.then(async data => {
			if (data) {
				let directoryPath = this.currentNode.file.relPath + '/' + data.name
				await this.sink.mkdir(directoryPath)
				let file = await this.sink.getFullFileInfo(directoryPath)
				let node = this._fileToKalpaNode(file)
				this.tree.options.stream.emit('data', node)
			}
		})

	}

	showVariantDetails(evt, selected) {
		let choiceBox = selected.closest('.variant-choice-box')
		let variant = choiceBox.variant

		let files = []
		if(variant.variants) {
			files.push(...variant.variants.map(variant => variant.file))
		}
		else {
			files.push(variant.file)
		}
		

		let content = '<ul>'
		for(let file of files) {
			content += '<li><a target="_blank" href="' + file.accessUrl + '">'
			content += file.name + '</a> - ' + this._formatBytes(file.stat.size)
			content += '</li>'
		}
		content += '</ul>'
		
		let dialog = new InfoDialog({
			title: 'File Details: ' + variant.baseName
			, body: content
			, buttons: [
				{
					classes: 'btn btn-primary btn-ok',
					label: 'OK'
				}
			]
		})
		let prom = dialog.open()
		prom.then(async data => {
			if (data) {
			}
		})

	}

	async findDirectories() {
		return new Promise((resolve, reject) => {
			let results = []
			let events = this.sink.find({
				file: false
			})
			events.on('data', (item) => {
				results.push(item)
			})
			events.on('done', () => {
				resolve(results)
			})
		})
	}

	async render() {
		this.el.innerHTML = imageBrowserFrame(this.model)
		this.data = []

		this.rootDirectory = await this.sink.getFullFileInfo('')
		this.rootDirectory.name = "Files"
		let rootNode = this.rootNode = this._fileToKalpaNode(this.rootDirectory)
		this.data.push(rootNode)


		let directories = await this.findDirectories()
		this._sortFiles(directories)

		this.data.push(...directories.map(this._fileToKalpaNode.bind(this)))
		KalpaTreeOnPage({
			treeContainerSelector: `#${this.id} .treebox`
			, data: this.data
		}).then(tree => {
			this.tree = tree
			tree.on('select', (node) => {
				this.setCurrentNode(node)
			})
			tree.on('selected', (node) => {
				// There's a bug, either in the browser or kalpa tree that causes it
				// not to examine if a scroll bar is needed for the tree if the content
				// area changes in a big way. Part of this bug may be that it's being
				// used in a grid which has some weird width/height effects
				// Anyway, we need to make sure the browser knows to examine the tree so
				// we change the height then change it back.
				// This event is triggered when kalpa-tree thinks it's done with transitions

				let tree = this.el.querySelector('.tree')
				tree.style.height = '99.99999%'
				setTimeout(() => {
					tree.style.height = '100%'
				}, 100)
			})
			tree.select(1)

		})
	}

	_sortFiles(files) {
		files.sort((one, two) => {
			return one.relPath.toLowerCase().localeCompare(two.relPath.toLowerCase())
		})

		return files
	}
	_compareVariants(one, two) {
		return one.baseName.toLowerCase().localeCompare(two.baseName.toLowerCase())
	}

	_createAccessUrl(file) {
		return file.accessUrl
	}

	_determineExtensions(variant) {
		let extensions = new Set()
		if (variant.variants) {
			for (let imgVariant of variant.variants) {
				extensions.add(imgVariant.ext)
			}
		}
		else {
			extensions.add(variant.ext)
		}

		let result = Array.from(extensions).filter(item => !!item)
		result.sort((a, b) => {
			return a.toLowerCase().localeCompare(b.toLowerCase())
		})

		return result
	}

	_determineSizes(variant) {
		let min = 2000000000
		let max = 0
		if (variant.variants) {
			for (let imgVariant of variant.variants) {
				let size = imgVariant.file.stat.size
				if (size > max) {
					max = size
				}
				if (size < min) {
					min = size
				}
			}
		}
		else {
			let size = variant.file.stat.size
			if (size > max) {
				max = size
			}
			if (size < min) {
				min = size
			}
		}
		return [min, max]
	}

	_formatBytes = formatBytes


	createVariantValues(info) {
		let variants = condense(info.children)
		let variantValues = Object.values(variants)

		let used = []
		for (let variant of variantValues) {
			if (variant.definitionFile) {
				used.push(variant.definitionFile.name)
			}
			for (let imgVariant of variant.variants) {
				used.push(imgVariant.file.name)
			}
		}

		let remainingChildren = info.children.filter(item => {
			return !used.includes(item.name)
		})
			.filter(item => !item.directory)

		// Add thumbnails
		for (let child of variantValues) {
			child.thumbnailIcon = 'image'
			if (child.preview) {
				child.thumbnail = this._createAccessUrl(child.preview.file)
			}
		}

		if(!this.imagesOnly) {
			for (let file of remainingChildren) {
				let info = {
					file: file
					, thumbnailIcon: 'description'
				}
				let name = file.name
				info.ext = name.substring(name.lastIndexOf('.') + 1)
				info.baseName = name.substring(0, name.lastIndexOf('.'))
				variantValues.push(info)
			}
		}


		// Determine extensions
		for (let item of variantValues) {
			item.extensions = this._determineExtensions(item)
			item.sizes = this._determineSizes(item)
			if (item.sizes[0] == item.sizes[1]) {
				item.size = this._formatBytes(item.sizes[0])	
			}
			else {
				item.size = this._formatBytes(item.sizes[0]) + ' - ' + this._formatBytes(item.sizes[1]) 
			}
		}

		variantValues.sort(this._compareVariants)
		return variantValues
	}

	async setCurrentNode(node) {
		this.currentNode = node
		let info = await this.sink.getFullFileInfo(node.file.relPath)
		let variantValues = this.createVariantValues(info)


		let content = ''
		for (let child of variantValues) {
			content += variantChoiceBox(child)
		}


		let choicesBoxes = this.el.querySelector('.choice-boxes')
		choicesBoxes.innerHTML = ''
		choicesBoxes.insertAdjacentHTML('beforeend', content)
		
		for(let i = 0; i < choicesBoxes.children.length; i++) {
			choicesBoxes.children[i].variant = variantValues[i]
		}
		this.el.querySelector('.box-holder').scrollTop = 0
	}

	_join(...parts) {
		parts = parts.filter(part => !!part)
		let path = parts.join('/')
		return path
	}

	_determineParentPath(path) {
		let parts = path.split('/')
		parts.pop()
		return parts.join('/')
	}

	_fileToKalpaNode(file) {
		let node = {
			id: this.idInd++
			, label: file.name
			, directory: file.directory
			, file: file
			, loaded: false
		}

		let parent = this.nodes[this._determineParentPath(file.relPath)]
		this.nodes[file.relPath] = node

		if (parent) {
			node.parentId = parent.id
			node.path = file.relPath
		}

		file.path = node.path
		return node
	}

	/*
	makeLocatedFileToKalpaNode(parent) {
		let self = this
		return function (file) {
			return self.fileToKalpaNode(file, parent)
		}
	}
	*/

}
