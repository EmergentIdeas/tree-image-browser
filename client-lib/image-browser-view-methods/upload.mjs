import { FormAnswerDialog } from '../form-answer-dialog.mjs'
import baseImageName from '../base-image-name.mjs'
import makeImageSet from '../make-image-set.mjs'
import nameParts from '../name-parts.mjs'
import getFileImageStats from '../get-file-image-stats.mjs'
import { guidedImageUploadForm, guidedFileUploadForm } from '../../views/load-browser-views.js'


export async function _uploadGuidedImageFile(file) {
	let baseFileName = baseImageName(file)
	let stats = await getFileImageStats(file)

	let data = {
		nativeName: file.name
		, name: baseFileName
		, outputFormat: file.type
		, stats: stats
		, width: Math.floor(stats.width / 2)
	}


	let dialog = new FormAnswerDialog({
		title: 'Upload File'
		, body: guidedImageUploadForm(data)
		, data: data
		, dialogFrameClass: 'webhandle-file-tree-image-browser'
	})
	let prom = dialog.open()
	let result = await prom

	if (result) {
		let makeImageData = {
			baseFileName: result.name
			, outputFormat: result.outputFormat
			, singleDensityWidth: parseInt(result.width)
			, altText: result.altText
		}

		let note = this._addPending(file)
		let files = await makeImageSet(file, makeImageData)

		for (let fileName of Object.keys(files)) {
			await this._uploadData(fileName, files[fileName])
		}

		if (note) {
			note.remove()
		}
		return true
	}
}

export async function _uploadGuidedFile(file) {
	let parts = nameParts(file)

	let data = {
		nativeName: file.name
		, name: parts.join('.')
	}


	let dialog = new FormAnswerDialog({
		title: 'Upload File'
		, body: guidedFileUploadForm(data)
		, data: data
		, dialogFrameClass: 'webhandle-file-tree-image-browser'
	})
	let prom = dialog.open()
	let result = await prom

	if (result) {
		let note = this._addPending(file)

		await this._uploadData(result.name, file)

		if (note) {
			note.remove()
		}
		return true
	}
}

export async function _uploadAutomaticImageFile(file) {
	let note = this._addPending(file)
	let parts = nameParts(file)
	let baseFileName = parts[0]

	let files = await makeImageSet(file, {
		baseFileName: baseFileName,
		outputFormat: file.type
	})

	for (let fileName of Object.keys(files)) {
		await this._uploadData(fileName, files[fileName])
	}

	if (note) {
		note.remove()
	}
	return true
}

export async function _uploadFiles(files, { uploadType } = {}) {
	for (let file of files) {

		let uploaded = false
		if (uploadType === 'guided' && this._isImageFile(file)) {
			uploaded = await this._uploadGuidedImageFile(file)
		}
		else if (uploadType === 'guided') {
			uploaded = await this._uploadGuidedFile(file)
		}
		else if (uploadType === 'automatic' && this._isImageFile(file)) {
			uploaded = await this._uploadAutomaticImageFile(file)
		}
		else {
			let note = this._addPending(file)
			if (uploadType === 'automatic') {
				let parts = nameParts(file)
				await this._uploadData(parts.join('.'), file)
			}
			else {
				await this._uploadData(file.name, file)
			}
			if (note) {
				note.remove()
			}
			uploaded = true
		}
		if (this.eventNotificationPanel && uploaded) {
			this.eventNotificationPanel.addNotification({
				model: {
					status: 'success',
					headline: `uploaded ${file.name}`
				}
				, ttl: 2000
			})
		}
	}
	this.setCurrentNode(this.currentNode)
}

