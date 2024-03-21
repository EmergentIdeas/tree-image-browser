import { InfoDialog } from '../info-dialog.mjs'

export function changeFilesView(evt, selected) {
	let choiceBoxes = this.el.querySelector('.choice-boxes')
	let classes = [...selected.closest('.view-icons').querySelectorAll('button')].map(button => button.getAttribute('data-show-class'))
	classes.forEach(item => {
		choiceBoxes.classList.remove(item)
	})
	choiceBoxes.classList.add(selected.getAttribute('data-show-class'))
}

export function applyFilter(evt, selected) {
	setTimeout(() => {
		let value = this.el.querySelector('[name="filter"]').value
		let allVariants = this.el.querySelectorAll('.choice-boxes .variant-choice-box')
		for (let variant of allVariants) {
			variant.classList.remove('hidden')
			if (value) {
				let searchString = variant.variant.baseName + variant.variant.extensions.join()
				if (searchString.indexOf(value) < 0) {
					variant.classList.add('hidden')
				}
			}
		}
	})
}

export function clearFilter(evt, selected) {
	this.el.querySelector('[name="filter"]').value = ''
	this.applyFilter()
}

export function selectVariant(evt, selected) {
	let currentSelected = this.el.querySelectorAll('.choice-boxes .variant-choice-box.selected')
	if (!evt.ctrlKey && !evt.shiftKey) {
		for (let sel of currentSelected) {
			sel.classList.remove('selected')
		}
	}

	if (evt.shiftKey) {
		let cur = selected
		do {
			if (cur.classList.contains('selected')) {
				break
			}
			cur.classList.add('selected')
			cur = cur.previousElementSibling
		}
		while (cur);
	}
	else {
		selected.classList.toggle('selected')
	}


	let sel = this.getSelectedFiles()
	this.emitter.emit('select', {
		type: 'select'
		, selected: sel
	})
}



export function showVariantDetails(evt, selected) {
	let choiceBox = selected.closest('.variant-choice-box')
	let variant = choiceBox.variant

	let files = this._getAssociatedRealFiles(variant)

	let content = '<ul>'
	for (let file of files) {
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