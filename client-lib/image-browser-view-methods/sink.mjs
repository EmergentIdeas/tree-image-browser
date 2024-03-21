
export async function _uploadData(name, data) {
	let path = this.currentNode.file.relPath + '/' + this.sanitizeFileName(name)
	await this.sink.write(path, data)
}

export async function findDirectories() {
	return new Promise((resolve, reject) => {
		let results = []
		let events = this.sink.find({
			file: false
		})
		events.on('data', (item) => {
			results.push(item)
		})
		events.on('done', () => {
			resolve(results)
		})
	})
}