import condense from '@dankolz/webp-detection/lib/condense-image-variants.js'
import escapeHtmlAttributeValue from '@dankolz/escape-html-attribute-value'
import addSoftBreaks from '../add-soft-breaks.mjs'

export function createVariantValues(info) {
	let variants = condense(info.children)
	let variantValues = Object.values(variants)

	let used = []
	for (let variant of variantValues) {
		used.push(...this._getAssociatedRealFiles(variant).map(variant => variant.name))
	}

	let remainingChildren = info.children.filter(item => {
		return !used.includes(item.name)
	})
		.filter(item => !item.directory)

	// Add thumbnails
	for (let child of variantValues) {
		child.thumbnailIcon = 'image'
		if (child.preview) {
			child.thumbnail = this._createAccessUrl(child.preview.file)
			child.safeThumbnail = escapeHtmlAttributeValue(child.thumbnail)
		}
	}

	if (!this.imagesOnly) {
		for (let file of remainingChildren) {
			let info = {
				file: file
				, thumbnailIcon: 'description'
			}
			let name = file.name
			info.ext = name.substring(name.lastIndexOf('.') + 1)
			info.baseName = name.substring(0, name.lastIndexOf('.'))
			variantValues.push(info)
		}
	}


	// Determine extensions, add additional top level info (safeBaseName)
	for (let item of variantValues) {
		item.extensions = this._determineExtensions(item)
		item.sizes = this._determineSizes(item)
		if (item.sizes[0] == item.sizes[1]) {
			item.size = this._formatBytes(item.sizes[0])
		}
		else {
			item.size = this._formatBytes(item.sizes[0]) + ' - ' + this._formatBytes(item.sizes[1])
		}
		item.safeBaseName = addSoftBreaks(escapeHtmlAttributeValue(item.baseName))
	}

	variantValues.sort(this._compareVariants)
	return variantValues
}

export async function _getFilesFromEvent(evt) {
	let files = []

	// items is the new interface we should use if that's available
	if (evt.dataTransfer.items) {
		let foundItems = [];
		[...evt.dataTransfer.items].forEach((item, i) => {
			foundItems.push(item)
		})
		for (let item of foundItems) {
			if (item.kind === "file") {
				if (item.webkitGetAsEntry) {
					let entry = item.webkitGetAsEntry()
					if (entry) {
						// if there's no entry, it's probably not a file, so we'll just ignore
						if (entry.isDirectory) {
							continue

							// Evenually we'll want to handle directories too, but for now we'll just go
							// on with the other items

							// var dirReader = entry.createReader()
							// dirReader.readEntries(function (entries) {
							// 	console.log(entries)
							// })
						}
						else {
							files.push(item.getAsFile())
						}

					}
				}
				else {
					files.push(item.getAsFile())
				}
			}
			else if (item instanceof File) {
				// Maybe from a file input element
				files.push(item)
			}
		}
	} else {
		[...evt.dataTransfer.files].forEach((file, i) => {
			files.push(file)
		})
	}
	return files
}

export function _getAssociatedRealFiles(variant) {
	let files = []
	if (variant.variants) {
		files.push(...variant.variants.map(variant => variant.file))
	}
	else {
		files.push(variant.file)
	}
	if (variant.definitionFile) {
		files.push(variant.definitionFile)
	}

	return files
}

export function _createAccessUrl(file) {
	return this.escapeAccessUrl(file.accessUrl)
}

function urlEscapeChars(chrs, url) {
	for (let c of chrs) {
		url = url.split(c).join(encodeURIComponent(c))
	}
	return url
}

export function escapeAccessUrl(url) {
	return urlEscapeChars(['%', ' ', '#', '?',  '<', '>', '$', '@', '^', '&'], url)
}


export function getSelectedFiles() {
	let result = {
		boxes: []
		, variants: []
		, files: []
		, names: []
	}
	let currentSelected = this.el.querySelectorAll('.choice-boxes .variant-choice-box.selected')
	if (currentSelected.length > 0) {
		for (let sel of currentSelected) {
			result.boxes.push(sel)
			result.variants.push(sel.variant)
			result.files.push(...this._getAssociatedRealFiles(sel.variant))
		}
		let names = result.files.map(file => file.name)
		result.names.push(...names)
	}

	return result
}

export function _transformRelativeUrlToPublic(url) {
	if(url.startsWith('/') == false) {
		url = '/' + url
	}
	return url	
}

export async function getSelectedUrl(selectedFiles) {
	if(!selectedFiles) {
		selectedFiles = this.getSelectedFiles()
	}
	
	if(selectedFiles.variants.length == 0) {
		return
	}
	
	let variant = selectedFiles.variants[0]
	let chosen
	if(variant.primary) {
		chosen = variant.primary.file
	}
	else {
		chosen = variant.file
	}
	
	let base = this._transformRelativeUrlToPublic(chosen.relPath)
	
	if(variant.definitionFile) {
		let defData = await this.sink.read(variant.definitionFile.relPath)
		try {
			let data = JSON.parse(defData)
			base += this.getSelectedUrlExtFromMeta(data)
		}
		catch(e) {

		}
	}
	
	return base

}

export function getSelectedUrlExtFromMeta(data) {
	let url = ''
	let sizes = data.displaySize.split('x')
	url += `#format=webp2x&width=${sizes[0]}&height=${sizes[1]}`
	
	if(data.altText) {
		url += '&alt=' + encodeURIComponent(data.altText)
	}
	
	return url
}
