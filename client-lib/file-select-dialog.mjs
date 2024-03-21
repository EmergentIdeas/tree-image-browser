import Dialog from 'ei-dialog'
import ImageBrowserView from './image-browser-view.mjs'

export class FileSelectDialog extends Dialog {
	constructor(options) {
		super(Object.assign({
			title: 'Select A File'
			, body: `<div class="webhandle-file-tree-image-browser" style="width: 87vw;"> </div>`
			, afterOpen: function (bodyElement, dialog) {

				let treeHolder = bodyElement.querySelector('.webhandle-file-tree-image-browser')
				if (treeHolder) {
					let imageBrowserView = this.imageBrowserView = new ImageBrowserView({
						sink: dialog.sink
						, imagesOnly: dialog.imagesOnly
						, eventNotificationPanel: dialog.eventNotificationPanel
						, startingDirectory: dialog.startingDirectory
						, deleteWithoutConfirm: dialog.deleteWithoutConfirm
					})
					imageBrowserView.appendTo(treeHolder)
					imageBrowserView.render()

					imageBrowserView.emitter.on('select', async function (evt) {

					})
				}

			}
		}, options,
			{
				on: {
					'.btn-ok': async () => {
						let result = {
							selection: this.imageBrowserView.getSelectedFiles()
						}
						result.url = await this.imageBrowserView.getSelectedUrl(result.selection)
						this.resolve(result)

						return true
					},
					'.mask': () => {
						this.resolve()
						return true
					},
					'.btn-cancel': () => {
						this.resolve()
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