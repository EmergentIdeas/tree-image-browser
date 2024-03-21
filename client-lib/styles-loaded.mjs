
/**
 * Returns true if the styles for the image browser have been loaded
 */
export default function areStylesLoaded() {
	let d = document.createElement('div')
	d.classList.add('webhandle-file-tree-image-browser-test')
	
	d.style.position = 'absolute'
	d.style.left = '-10000px'
	
	
	document.body.appendChild(d)
	let color = window.getComputedStyle(d)['background-color'] 
	d.remove()

	return color === 'rgb(101, 105, 99)'
}