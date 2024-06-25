
function breakOnChars(chrs, txt) {
	for (let c of chrs) {
		txt = txt.split(c).join('<wbr>' + c)
	}
	return txt
}

export default function addSoftBreaks(txt) {
	if(!txt || typeof txt !== 'string') {
		return txt
	}
	
	let chars = [...txt]
	txt = ''
	for(let i = 0; i < chars.length; i++) {
		txt += chars[i]
		if(i % 10 === 0) {
			txt += '<wbr>'
		}
	}
	txt = breakOnChars(['_'], txt)

	return txt
}