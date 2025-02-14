import Dialog from 'ei-dialog'
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
			, afterOpen: function (bodyElement, dialog) {

				let treeHolder = bodyElement.querySelector('.webhandle-file-tree-image-browser')
				if (treeHolder) {
					let options = {
						sink: dialog.sink
						, imagesOnly: dialog.imagesOnly
						, eventNotificationPanel: dialog.eventNotificationPanel
						, startingDirectory: dialog.startingDirectory
						, deleteWithoutConfirm: dialog.deleteWithoutConfirm
					}
					
					let imageBrowserView = this.imageBrowserView = new ImageBrowserView(options)
					if(dialog._createAccessUrl) {
						imageBrowserView._createAccessUrl = dialog._createAccessUrl
					}
					if(dialog._transformRelativeUrlToPublic) {
						imageBrowserView._transformRelativeUrlToPublic = dialog._transformRelativeUrlToPublic
					}
					imageBrowserView.appendTo(treeHolder)
					imageBrowserView.render()

					imageBrowserView.emitter.on('select', async function (evt) {

					})
					imageBrowserView.emitter.on('upload', async function (evt) {
						if(dialog.chooseOnUpload) {
							dialog.close()
							dialog.resolve({
								url: evt.accessUrls[0]
							})
						}
					})
				}
			}
			, chooseOnUpload: true
		}, options,
			{
				on: {
					'.btn-ok': async () => {
						let result = {
							selection: this.imageBrowserView.getSelectedFiles()
						}
						result.url = await this.imageBrowserView.getSelectedUrl(result.selection)
						this.imageBrowserView.cleanup()
						this.resolve(result)

						return true
					},
					'.mask': () => {
						this.resolve()
						this.imageBrowserView.cleanup()
						return true
					},
					'.btn-cancel': () => {
						this.resolve()
						this.imageBrowserView.cleanup()
						return true
					}
				}
			}
		))
	}

	async open() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
		super.open()

		return this.promise
	}
}