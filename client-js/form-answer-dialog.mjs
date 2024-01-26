import Dialog from 'ei-dialog'

export class FormAnswerDialog extends Dialog {
	constructor(options) {
		super(Object.assign({}, options,
			{
				on: {
					'.btn-ok': () => {
						this.resolve(this.gatherFormData())
						return true
					},
					'.mask': () => {
						// console.log('mask')
						this.resolve()
						return true
					},
					'.btn-cancel': () => {
						// console.log('cancel')
						this.resolve()
						return true
					}
				}

			}
		))
	}

	gatherFormData() {
		let result = {}
		let dialogBody = document.querySelector(this.getBodySelector())
		let controls = dialogBody.querySelectorAll('input, textarea, select')
		for (let control of controls) {
			result[control.getAttribute('name')] = control.value
		}
		return result

	}

	async open() {
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve
			this.reject = reject
		})
		super.open()

		return this.promise
	}

}