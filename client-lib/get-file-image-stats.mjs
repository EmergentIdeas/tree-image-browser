import dataToImage from './data-to-image.mjs'
import getImageStats from './get-image-stats.mjs'
import getExtension from './get-extension-from-mime.mjs'

/**
 * 
 * @param {File} file 
 * @returns 
 */
export default async function getFileImageStats(file) {
	let source = await dataToImage(file)
	let stats = await getImageStats(source)
	stats.ratio = stats.width / stats.height
	stats.ext = getExtension(file.type)

	return stats
}