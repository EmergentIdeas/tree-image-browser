
let types = {
	"image/png": "png"
	, "image/jpeg": "jpg"
	, "image/jpg": "jpg"
	, "image/webp": "webp"
}


export default function getExtension(mime) {
	if (mime in types) {
		return types[mime]
	}

	let ext = mime.split('/').pop()
	return ext
}
