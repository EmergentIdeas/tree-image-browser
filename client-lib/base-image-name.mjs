
/**
 * 
 * @param {File,string} file 
 */
export default function baseImageName(file) {
	let name
	if(typeof file === 'string') {
		name = file
	}
	else if(file instanceof File) {
		name = file.name
	}
	
	let parts = name.split('.')
	
	if(parts.length > 1) {
		parts.pop()
	}
	name = parts.join('.')
	name = name.replace(/-@2x$/, '')
	name = name.replace(/@2x$/, '')
	name = name.replace(/-2x$/, '')
	name = name.replace(/2x$/, '')

	let chars = [name.substring(0, 1)]
	for(let char of name.substring(1)) {
		if(char.match(/[A-Z]/)) {
			chars.push('-')
		}
		chars.push(char)
	}
	name = chars.join('')

	name = name.toLowerCase()
	name = name.replace(/[^1234567890a-z-]/g, '-')
	name = name.replace(/--+/g, '-')
	

	return name
}