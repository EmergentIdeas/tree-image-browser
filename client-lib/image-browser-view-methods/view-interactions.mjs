import { InfoDialog } from '../info-dialog.mjs'
import escapeHtmlAttributeValue from '@dankolz/escape-html-attribute-value'

export function changeFilesView(evt, selected) {
	let className = selected.getAttribute('data-show-class')
	this.changeFilesViewToClass(className)
}

export function changeFilesViewToClass(className) {
	let choiceBoxes = this.el.querySelector('.choice-boxes')
	let classes = [...this.el.querySelector('.view-icons').querySelectorAll('button')].map(button => button.getAttribute('data-show-class'))
	classes.forEach(item => {
		choiceBoxes.classList.remove(item)
	})
	choiceBoxes.classList.add(className)
}

export function applyFilter(evt, selected) {
	setTimeout(() => {
		let value = this.el.querySelector('[name="filter"]').value
		let allVariants = this.el.querySelectorAll('.choice-boxes .variant-choice-box')
		for (let variant of allVariants) {
			variant.classList.remove('hidden')
			if (value) {
				value = value.toLowerCase()
				let searchString = variant.variant.baseName.toLowerCase() + variant.variant.extensions.map(ext => ext.toLowerCase()).join()
				if (searchString.indexOf(value) < 0) {
					variant.classList.add('hidden')
				}
			}
		}
		this.setFolderInfo()
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

	let content = '<div class="variant-details-information">'
	if (variant.safeThumbnail) {
		content += `<div class="details-preview-image">
		<img loading="lazy" src="${variant.safeThumbnail}" />
		</div>`
	}

	content += '<ul class="variants">'
	for (let file of files) {
		content += '<li><a target="_blank" href="' + escapeHtmlAttributeValue(this.escapeAccessUrl(file.accessUrl)) + '">'
		content += escapeHtmlAttributeValue(file.name) + '</a> - ' + this._formatBytes(file.stat.size)
		content += '</li>'
	}
	content += '</ul>'

	content += '</div>'

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

export function setFolderInfo() {
	let fileCount = 0
	let variantCount = 0
	let byteCount = 0
	let nonImages = 0
	let allVariants = this.el.querySelectorAll('.choice-boxes .variant-choice-box')
	for (let variant of allVariants) {
		if (variant.classList.contains('hidden')) {
			continue
		}
		variantCount++

		if (variant.variant.variants) {
			variant.variant.variants.forEach(variant => {
				fileCount++
				byteCount += variant.file.stat.size
			})

		}
		else {
			fileCount++
			byteCount += variant.variant.file.stat.size
			nonImages++
		}
	}
	this.el.querySelector('.folder-info').innerHTML = `${variantCount} items / ${fileCount} files / ${this._formatBytes(byteCount)} `
	if (variantCount > this.listTriggerSize) {
		this.changeFilesViewToClass('list-text')
	}
	this.el.querySelector('.view-icons').classList.remove('no-img')
	if (variantCount - nonImages > this.listLockSize) {
		this.el.querySelector('.view-icons').classList.add('no-img')
	}
}

export function cleanFileInfo() {
	this.el.querySelector('.folder-info').innerHTML = ''
	let choicesBoxes = this.el.querySelector('.choice-boxes')
	choicesBoxes.innerHTML = '<div class="loading-info">Loading Information Now</div>'
	this.el.querySelector('.view-icons').classList.add('no-img')
}
