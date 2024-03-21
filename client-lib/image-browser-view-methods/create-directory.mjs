import { FormAnswerDialog } from '../form-answer-dialog.mjs'

export function createDirectory(evt, selected) {
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
			let cur = this.tree.selected()
			if (cur) {
				this.tree.expand(cur.id)
			}
		}
	})

}