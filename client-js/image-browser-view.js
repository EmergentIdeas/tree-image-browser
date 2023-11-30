import { View } from '@webhandle/backbone-view'
import { imageBrowserFrame, variantChoiceBox } from '../views/load-browser-views.js'
import KalpaTreeOnPage from 'kalpa-tree-on-page'
import condense from '@dankolz/webp-detection/lib/condense-image-variants.js'
import basename from '@dankolz/webp-detection/lib/file-basename.js'

export default class ImageBrowserView extends View {
	preinitialize() {
		this.className = 'image-browser'
		this.idInd = 1
		this.nodes = {}
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
		let rootNode = this._fileToKalpaNode(this.rootDirectory)
		this.data.push(rootNode)


		let directories = await this.findDirectories()
		this._sortFiles(directories)

		this.data.push(...directories.map(this._fileToKalpaNode.bind(this)))
		KalpaTreeOnPage({
			treeContainerSelector: `#${this.id} .tree`
			, data: this.data
		}).then(tree => {
			this.tree = tree
			tree.on('select', (node) => {
				this.setCurrentNode(node)
			})
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

	async setCurrentNode(node) {
		this.currentNode = node
		let info = await this.sink.getFullFileInfo(node.file.relPath)
		let variants = condense(info.children)
		let variantValues = Object.values(variants)
		variantValues.sort(this._compareVariants)
		
		// Add thumbnails
		for (let child of variantValues) {
			child.thumbnailIcon = 'image'
			if(child.preview) {
				child.thumbnail = this._createAccessUrl(child.preview.file)
			}
		}

		let content = ''
		for (let child of variantValues) {
			content += variantChoiceBox(child)
		}
		this.el.querySelector('.choice-boxes').innerHTML = content
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
