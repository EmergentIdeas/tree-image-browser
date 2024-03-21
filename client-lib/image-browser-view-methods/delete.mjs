import { FormAnswerDialog } from '../form-answer-dialog.mjs'

export async function deleteFile(evt, selected) {
	let sel = this.getSelectedFiles()

	if (sel.files.length > 0) {

		let files = sel.files
		let names = sel.names

		if (!this.deleteWithoutConfirm) {
			let dialog = new FormAnswerDialog({
				title: 'Delete File' + (files.length > 1 ? 's' : '')
				, body: '<p>' + names.join(', ') + '</p>'
			})
			let prom = dialog.open()
			let ans = await prom
			if (!ans) {
				return
			}
		}

		for (let file of files) {
			let path = file.relPath
			let note
			if (this.eventNotificationPanel) {
				note = this.eventNotificationPanel.addNotification({
					model: {
						status: 'pending',
						headline: `deleting ${file.name}`
					}
				})
			}
			await this.sink.rm(path)
			if (this.eventNotificationPanel) {
				note.remove()
				note = this.eventNotificationPanel.addNotification({
					model: {
						status: 'success',
						headline: `removed ${file.name}`
					}
					, ttl: 2000
				})
			}
		}
		for (let item of sel.boxes) {
			item.remove()
		}
	}
	this.emitter.emit('delete', {
		type: 'delete'
		, selected: sel
	})
}

export async function deleteDirectory(evt, selected) {
	let path = this.currentNode.file.relPath
	let name = this.currentNode.file.name

	if (!path) {
		// probably the root, just cancel
		return
	}

	let dialog = new FormAnswerDialog({
		title: 'Delete Directory'
		, body: '<p>' + name + '</p>'
	})
	let prom = dialog.open()
	let ans = await prom
	if (!ans) {
		return
	}
	let note
	if (this.eventNotificationPanel) {
		note = this.eventNotificationPanel.addNotification({
			model: {
				status: 'pending',
				headline: `deleting ${name}`
			}
		})
	}
	await this.sink.rm(path, { recursive: true })
	let curSelected = this.tree.selected()
	let parent = this.tree.parent(curSelected)

	this.tree.removeNode(curSelected)
	this.tree.select(parent.id)

	if (this.eventNotificationPanel) {
		note.remove()
		note = this.eventNotificationPanel.addNotification({
			model: {
				status: 'success',
				headline: `removed ${name}`
			}
			, ttl: 2000
		})
	}
}
