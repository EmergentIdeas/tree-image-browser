import dataToImage from "./data-to-image.mjs";

export default async function getImageStats(data) {
	let img = await dataToImage(data)
	return {
		width: img.naturalWidth
		, height: img.naturalHeight

	}

}