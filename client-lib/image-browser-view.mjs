import { View } from '@webhandle/backbone-view'
import { imageBrowserFrame, variantChoiceBox } from '../views/load-browser-views.js'
import KalpaTreeOnPage from 'kalpa-tree-on-page'
// import basename from '@dankolz/webp-detection/lib/file-basename.js'
// import Dialog from 'ei-dialog'
import formatBytes from './format-bytes.mjs'
// import baseImageName from './base-image-name.mjs'
// import makeImageSet from './make-image-set.mjs'
// import nameParts from './name-parts.mjs'
// import getFileImageStats from './get-file-image-stats.mjs'
// import getExtension from './get-extension-from-mime.mjs'

import Emitter from '@webhandle/minimal-browser-event-emitter'


// method imports
import { deleteFile, deleteDirectory } from './image-browser-view-methods/delete.mjs'
import {
	_join, _determineParentPath, _fileToKalpaNode, _determineExtensions,
	_determineSizes, _sortFiles, _compareVariants, sanitizeFileName, _isImageFile
} from './image-browser-view-methods/utils.mjs'
import { changeFilesView, applyFilter, clearFilter, selectVariant, showVariantDetails } from './image-browser-view-methods/view-interactions.mjs'
import { getDropCoverSelector, handleDrop, isFileTypeDrag, dragEnter, dragLeave, dragOver, _cleanupDropDone } from './image-browser-view-methods/drag-and-drop.mjs'
import { createDirectory } from './image-browser-view-methods/create-directory.mjs'
import { createVariantValues, _getFilesFromEvent, _getAssociatedRealFiles, _createAccessUrl, 
	getSelectedFiles, _transformRelativeUrlToPublic, getSelectedUrl } from './image-browser-view-methods/file-obj-manipulation.mjs'
import { _uploadGuidedImageFile, _uploadGuidedFile, _uploadAutomaticImageFile, _uploadFiles } from './image-browser-view-methods/upload.mjs'
import { _uploadData, findDirectories } from './image-browser-view-methods/sink.mjs'


export default class ImageBrowserView extends View {
	/**
	 * Construct a new file browser
	 * @param {object} options 
	 * @param {FileSink} options.sink The file to use as a file source
	 * @param {boolean} options.imagesOnly Set to true if you would like to display only images
	 * @param {boolean} options.allowFileSelection Set to true so that selected files are marked
	 * @param {EventNotificationPanel} options.eventNotificationPanel The panel which status messages will be added to.
	 * @param {string} options.startingDirectory
	 * @param {boolean} options.deleteWithoutConfirm False by default
	 * @param {Emitter} options.emitter Emitter for various file events
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
			, 'click .delete-file': 'deleteFile'
			, 'click .delete-directory': 'deleteDirectory'
			, 'click .variant-choice-box .details': 'showVariantDetails'
			, 'dblclick .variant-choice-box': 'showVariantDetails'
			, 'click .variant-choice-box': 'selectVariant'
			, 'click .view-icons button': 'changeFilesView'
			, 'keyup [name="filter"]': 'applyFilter'
			, 'change [name="filter"]': 'applyFilter'
			, 'click .clear-filter': 'clearFilter'
			, 'dragenter .': 'dragEnter'
			, 'dragleave .': 'dragLeave'
			, 'dragover .': 'dragOver'
			, 'drop .': 'handleDrop'
		}
		this.overCount = 0

		if (!this.emitter) {
			this.emitter = new Emitter()
		}
	}

	_addPending(file) {
		let note
		if (this.eventNotificationPanel) {
			note = this.eventNotificationPanel.addNotification({
				model: {
					status: 'pending',
					headline: `uploading ${file.name}`
				}
			})
		}
		return note
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
			if (this.startingDirectory) {
				for (let node of Object.values(this.tree.nodes)) {
					if (node.file && node.file.relPath && node.file.relPath == this.startingDirectory) {
						tree.select(node.id)
						break
					}
				}
			}
			else {
				tree.select(1)
			}
		})
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

		for (let i = 0; i < choicesBoxes.children.length; i++) {
			choicesBoxes.children[i].variant = variantValues[i]
		}
		this.el.querySelector('.box-holder').scrollTop = 0
		this.applyFilter()
	}

	// uploads
	_uploadGuidedImageFile = _uploadGuidedImageFile
	_uploadGuidedFile = _uploadGuidedFile
	_uploadAutomaticImageFile = _uploadAutomaticImageFile
	_uploadFiles = _uploadFiles

	// file-obj-manipulation
	createVariantValues = createVariantValues
	_getFilesFromEvent = _getFilesFromEvent
	_getAssociatedRealFiles = _getAssociatedRealFiles
	_createAccessUrl = _createAccessUrl
	getSelectedFiles = getSelectedFiles
	_transformRelativeUrlToPublic = _transformRelativeUrlToPublic
	getSelectedUrl = getSelectedUrl

	// create-directory 
	createDirectory = createDirectory

	// drag-and-drop
	getDropCoverSelector = getDropCoverSelector
	handleDrop = handleDrop
	isFileTypeDrag = isFileTypeDrag
	dragEnter = dragEnter
	dragLeave = dragLeave
	dragOver = dragOver
	_cleanupDropDone = _cleanupDropDone

	// view-interactions
	changeFilesView = changeFilesView
	applyFilter = applyFilter
	clearFilter = clearFilter
	selectVariant = selectVariant
	showVariantDetails = showVariantDetails

	// utils
	sanitizeFileName = sanitizeFileName
	_sortFiles = _sortFiles
	_compareVariants = _compareVariants
	_determineExtensions = _determineExtensions
	_determineSizes = _determineSizes
	_join = _join
	_determineParentPath = _determineParentPath
	_fileToKalpaNode = _fileToKalpaNode
	_formatBytes = formatBytes
	_isImageFile = _isImageFile

	// delete
	deleteFile = deleteFile
	deleteDirectory = deleteDirectory

	// sink
	_uploadData = _uploadData
	findDirectories = findDirectories

}
