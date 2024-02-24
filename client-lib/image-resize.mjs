import dataToImage from "./data-to-image.mjs"

/*image, base64 encoded data of image, blob, file, or arraybuffer */
export default async function resizeImage(imageData,
	{ maxWidth = 1920, quality = .7, outputFormat = "image/png" } = {}) {
	return new Promise(async (resolve, reject) => {

		try {
			let resizeImg = await dataToImage(imageData)
			let ratio = resizeImg.naturalWidth / maxWidth
			let maxHeight = resizeImg.naturalHeight / ratio

			var resizeCanvas = document.createElement('canvas');
			resizeCanvas.width = maxWidth;
			resizeCanvas.height = maxHeight;

			var ctx = resizeCanvas.getContext('2d');
			ctx.clearRect(0, 0, resizeCanvas.width, resizeCanvas.height);
			ctx.drawImage(resizeImg, 0, 0, resizeCanvas.width, resizeCanvas.height);


			resizeCanvas.toBlob((blob) => {
				resolve(blob)
			}, outputFormat, quality);
		} catch (e) {
			if (console && console.log) {
				console.log('error resizing image: ' + e);
			}
			reject(e)
		}
	})
}
