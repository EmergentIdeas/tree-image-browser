import { Dialog } from '@webhandle/dialog'
import ImageBrowserView from './image-browser-view.mjs'

/**
 * Selects a file.
 * @param {Object} [options]
 * @param {string} [options.title] The dialog box title
 * @param {boolean} [options.chooseOnUpload] If true, uploading a file causes the dialog to close and the URL of uploaded
 * file to be returned
 */
export class FileSelectDialog extends Dialog {
	constructor(options) {
		super(Object.assign({
			title: 'Select A File'
			, body: `<div class="webhandle-file-tree-image-browser" style="width: 87vw;"> </div>`
			, afterOpen: function () {

				let treeHolder = this.el.querySelector('.body').querySelector('.webhandle-file-tree-image-browser')
				if (treeHolder) {
					let options = {
						sink: this.sink
						, imagesOnly: this.imagesOnly
						, eventNotificationPanel: this.eventNotificationPanel
						, startingDirectory: this.startingDirectory
						, deleteWithoutConfirm: this.deleteWithoutConfirm
					}
					
					let imageBrowserView = this.imageBrowserView = new ImageBrowserView(options)
					if(this._createAccessUrl) {
						imageBrowserView._createAccessUrl = this._createAccessUrl
					}
					if(this._transformRelativeUrlToPublic) {
						imageBrowserView._transformRelativeUrlToPublic = this._transformRelativeUrlToPublic
					}
					imageBrowserView.appendTo(treeHolder)
					imageBrowserView.render()

					imageBrowserView.emitter.on('select', async (evt) => {

					})
					imageBrowserView.emitter.on('upload', async (evt) => {
						if(this.chooseOnUpload) {
							this.imageBrowserView.cleanup()
							this.cleanup()
							this.resolve({
								url: evt.accessUrls[0]
							})
						}
					})
				}
			}
			, chooseOnUpload: true
		}, options
		))
	}
	async okay() {
		let result = {
			selection: this.imageBrowserView.getSelectedFiles()
		}
		result.url = await this.imageBrowserView.getSelectedUrl(result.selection)
		this.imageBrowserView.cleanup()
		this.cleanup()
		this.resolve(result)
	}
	cancel() {
		this.resolve(false)
		this.imageBrowserView.cleanup()
		this.cleanup()
	}
	close() {
		this.resolve(false)
		this.imageBrowserView.cleanup()
		this.cleanup()
	}

}