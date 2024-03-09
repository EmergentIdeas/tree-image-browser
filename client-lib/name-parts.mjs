import baseImageName from "./base-image-name.mjs"

/**
 * 
 * @param {File,string} file 
 */
export default function nameParts(file) {
	let name
	if(typeof file === 'string') {
		name = file
	}
	else if(file instanceof File) {
		name = file.name
	}
	
	let result = [baseImageName(name)]
	
	let parts = name.split('.')
	if(parts.length > 1) {
		result.push(parts.pop())
	}
	
	return result
}