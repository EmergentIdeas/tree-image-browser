import { Dialog, FormAnswerDialog } from '@webhandle/dialog'
import escapeHtmlAttributeValue from '@dankolz/escape-html-attribute-value'
import addSoftBreaks from '../add-soft-breaks.mjs'
import { fileDialogContentWithEditor  } from '../../views/load-browser-views.js'
import isImageFileName from '../is-image-file-name.mjs'

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



export async function showVariantDetails(evt, selected) {
	let choiceBox = selected.closest('.variant-choice-box')
	let variant = this.shownVariant = choiceBox.variant

	let files = this._getAssociatedRealFiles(variant)
	
	let url = await this.getSelectedUrl({variants: [variant]})
	let alt = ''
	
	if(variant.definitionFile && url) {
		let ind = url.indexOf('&alt=')
		if(ind > -1) {
			// we have an alt value
			alt = decodeURIComponent(url.substring(ind + 5))
		}
	}
	
	let isImage = variant.thumbnailIcon === 'image'
	let content = ''

	if(isImage) {
		content = '<div class="variant-details-information">'
		if (variant.safeThumbnail) {
			content += `<div class="details-preview-image">
			<img loading="lazy" src="${variant.safeThumbnail}" />
			</div>`
		}

		content += '<table class="variants" cellspacing="2">'
		for (let file of files) {
			content += '<tr><td><a target="_blank" href="' + escapeHtmlAttributeValue(this.escapeAccessUrl(file.accessUrl)) + '">'
			content += escapeHtmlAttributeValue(file.name) + '</a> </td><td> ' + this._formatBytes(file.stat.size)
			content += '</td></tr>'
		}
		content += '</table>'
		
		content += `<div>webp url: ${addSoftBreaks(url)}</div>`
		
		content += '<div class="alt" style="margin-top: 10px;"><label>Alternative text: <br><input type="text" style="width: 100%; margin-top: 5px; box-sizing: border-box;" name="alt" /></label></div>'

		content += '</div>'
	}
	else {
		let data = {
			url: url
			, urlText: addSoftBreaks(url)
			, showEditButton: files.length === 1
		}
		content = fileDialogContentWithEditor(data)
	}

	let dialog = new FormAnswerDialog({
		title: 'File Details: ' + variant.baseName
		, body: content
		// , showCancelButton: false
		, afterOpen: () => {
			let editButton = dialog.el.querySelector('.edit-file-content')
			if(editButton) {
				editButton.addEventListener('click', this.editFileContent.bind(this))
			}
			let downloadButton = dialog.el.querySelector('.download-file-content')
			if(downloadButton) {
				downloadButton.addEventListener('click', this.downloadFileContent.bind(this))
			}
		}
		, data: {
			alt: alt
		}
	})
	let prom = dialog.open()
	prom.then(async data => {
		if (data && isImage) {
			if(data.alt != alt && variant.definitionFile) {
				try {
					let defData = await this.sink.read(variant.definitionFile.relPath)
					let meta = JSON.parse(defData)
					meta.altText = data.alt
					await this.sink.write(variant.definitionFile.relPath, JSON.stringify(meta))
				}
				catch(e) {
					console.log(e)
				}
				
			}
		}
	})

}

export async function editFileContent(evt, selected) {
	try {

		let files = this._getAssociatedRealFiles(this.shownVariant)
		let curItem = files[0]
	
		let content = (await this.sink.read(curItem.relPath)).toString()
		let html = '<div class="ei-form-styles"><label>File content: <textarea type="text" name="fileContent" style="height: 80vh" ></textarea></label></div>'

		let dialog = new FormAnswerDialog({
			body: html
			, afterOpen: () => {
				let textarea = dialog.el.querySelector('textarea[name="fileContent"]')
				textarea.value = content
			}
			, styles: {
				width: "90%"
			}
		})
		let answer = await dialog.open()
		if(answer && answer.fileContent) {
			await this.sink.write(curItem.relPath, answer.fileContent)
		}
	}
	catch(e) {
		alert('Could not open the file.')
	}
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
