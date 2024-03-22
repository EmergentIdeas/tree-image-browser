
export function getDropCoverSelector() {
	return '.img-drop-cover'
}

export async function handleDrop(evt, selected) {
	let uploadType = 'literal'
	let dropSquare = evt.target.closest('.drop-type')
	if (dropSquare) {
		if (dropSquare.classList.contains('guided-upload')) {
			uploadType = 'guided'
		}
		else if (dropSquare.classList.contains('automatic')) {
			uploadType = 'automatic'
		}
	}

	this._cleanupDropDone()
	evt.preventDefault()
	let files = await this._getFilesFromEvent(evt)
	this.uploadFiles(files, { uploadType })
}

export function isFileTypeDrag(evt) {
	let fileType = true
	if (evt.dataTransfer) {
		if (evt.dataTransfer.items[0].kind === 'string') {
			fileType = false
		}
	}

	return fileType
}

export function dragEnter(evt, selected) {
	let overlay = this.isFileTypeDrag(evt)
	if (overlay) {
		this.overCount++
		this.el.querySelector(this.getDropCoverSelector()).classList.add('file-dropping')
	}
}
export function dragLeave(evt, selected) {
	if (this.isFileTypeDrag(evt)) {
		this.overCount--
		if (this.overCount == 0) {
			this._cleanupDropDone()
		}
	}
}
export function dragOver(evt, selected) {
	evt.preventDefault()
}

export function _cleanupDropDone() {
	this.overCount = 0;
	[...this.el.querySelectorAll('.file-dropping')].forEach(cover => cover.classList.remove('file-dropping'))
}