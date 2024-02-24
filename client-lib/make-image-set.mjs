import resizeImage from '../client-lib/image-resize.mjs'
import dataToImage from '../client-lib/data-to-image.mjs'
import getImageStats from '../client-lib/get-image-stats.mjs'


let types = {
	"image/png": "png"
	, "image/jpeg": "jpg"
	, "image/jpg": "jpg"
	, "image/webp": "webp"
}

let webpMime = 'image/webp'

function getExtension(mime) {

	if (mime in types) {
		return types[mime]
	}

	let ext = mime.split('/').pop()
	return ext
}

export default async function makeImageSet(data,
	{ singleDensityWidth = null
		, quality = .7
		, outputFormat = "image/png"
		, doubleDensityInput = true
		, baseFileName } = {}
) {
	let source = await dataToImage(data)
	let stats = await getImageStats(source)
	let ratio = stats.width / stats.height

	if (!baseFileName) {
		baseFileName = "" + (new Date().getTime())
	}
	if (!singleDensityWidth) {
		if (doubleDensityInput) {
			singleDensityWidth = stats.width / 2
		}
		else {
			singleDensityWidth = stats.width
		}
	}
	let doubleDensityWidth = singleDensityWidth * 2

	let suffixes = {
		'-2x': doubleDensityWidth
		, '': singleDensityWidth
		, '-half': Math.floor(singleDensityWidth / 2)
		, '-quarter': Math.floor(singleDensityWidth / 4)
	}

	let files = {}

	for (let key of Object.keys(suffixes)) {
		let width = suffixes[key]
		let data = await resizeImage(source, {
			maxWidth: width
			, quality: quality
			, outputFormat: outputFormat
		})
		files[baseFileName + key + '.' + getExtension(outputFormat)] = data

		data = await resizeImage(source, {
			maxWidth: width
			, quality: quality
			, outputFormat: webpMime
		})
		files[baseFileName + key + '.' + getExtension(webpMime)] = data
	}


	let info = {
		"name": baseFileName,
		"size": doubleDensityWidth + "x" + (doubleDensityWidth / ratio),
		"displaySize": singleDensityWidth + "x" + (singleDensityWidth / ratio),
		"fallback": getExtension(outputFormat)
	}
	files[baseFileName + '.json'] = JSON.stringify(info, null, '\t')

	return files

}