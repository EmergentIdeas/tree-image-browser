
export default function isImageFileName(fileName) {
	let ext = fileName.split('.').pop().toLowerCase()
	
	if (ext == 'jpeg' || ext == 'jpg' || ext == 'png' || ext == 'webp') {
		return true
	}
	return false
}