
export function _join(...parts) {
	parts = parts.filter(part => !!part)
	let path = parts.join('/')
	return path
}

export function _determineParentPath(path) {
	let parts = path.split('/')
	parts.pop()
	return parts.join('/')
}

export function _fileToKalpaNode(file) {
	let node = {
		id: this.idInd++
		, label: file.name
		, directory: file.directory
		, file: file
		, loaded: false
	}

	let parent = this.nodes[this._determineParentPath(file.relPath)]
	this.nodes[file.relPath] = node

	if (parent) {
		node.parentId = parent.id
		node.path = file.relPath
	}

	file.path = node.path
	return node
}

export function _determineExtensions(variant) {
	let extensions = new Set()
	if (variant.variants) {
		for (let imgVariant of variant.variants) {
			extensions.add(imgVariant.ext)
		}
	}
	else {
		extensions.add(variant.ext)
	}

	let result = Array.from(extensions).filter(item => !!item)
	result.sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase())
	})

	return result
}

export function _determineSizes(variant) {
	let min = 2000000000
	let max = 0
	if (variant.variants) {
		for (let imgVariant of variant.variants) {
			let size = imgVariant.file.stat.size
			if (size > max) {
				max = size
			}
			if (size < min) {
				min = size
			}
		}
	}
	else {
		let size = variant.file.stat.size
		if (size > max) {
			max = size
		}
		if (size < min) {
			min = size
		}
	}
	return [min, max]
}

export function _sortFiles(files) {
	files.sort((one, two) => {
		return one.relPath.toLowerCase().localeCompare(two.relPath.toLowerCase())
	})

	return files
}

export function _compareVariants(one, two) {
	return one.baseName.toLowerCase().localeCompare(two.baseName.toLowerCase())
}

export function sanitizeFileName(name) {
	return name.split('/').join('-').split('..').join('-')
}


export function _isImageFile(file) {
	if (!file.type.startsWith('image')) {
		return false
	}
	if (file.type.includes('jpeg') || file.type.includes('png') || file.type.includes('webp')) {
		return true
	}
	return false
}
