
/**
 * Takes data, perhaps even an image, and resolves to a fully 
 * loaded image.
 * @param {Blob,ArrayBuffer,string,Image} data 
 */
export default async function dataToImage(data) {
	return new Promise((resolve, reject) => {
		let finalImage
		let objectUrl
		if (data instanceof Image) {
			finalImage = data
		}
		else if (typeof data === 'string') {
			finalImage = new Image();
			finalImage.src = data;
		}
		// ArrayBuffer.isView(data) might be true or could be a Blob or File
		else {
			// let's make a blob first. This works if it's an ArrayBuffer of a Blob
			let imageBlob = new Blob([data])
			objectUrl = URL.createObjectURL(imageBlob)

			finalImage = new Image()
			finalImage.src = objectUrl
		}

		function finish() {
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl)
			}
			resolve(finalImage)
		}
		if (finalImage.complete) {
			finish()
		}
		else {
			// we'll have to wait till it's loaded
			finalImage.addEventListener('load', () => {
				finish()
			})
		}
	})

}