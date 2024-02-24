import Dialog from 'ei-dialog'
import formValueInjector from 'form-value-injector'

export class FormAnswerDialog extends Dialog {
	/**
	 * 
	 * @param {Object} options Properties to create the dialog box. In addition to the properties from Dialog
	 * there those below.
	 * @param {Object} options.data The data which will be used to populate the controls in the dialog
	 */
	constructor(options) {
		super(Object.assign({}, options,
			{
				on: {
					'.btn-ok': () => {
						this.resolve(this.gatherFormData())
						return true
					},
					'.mask': () => {
						this.resolve()
						return true
					},
					'.btn-cancel': () => {
						this.resolve()
						return true
					}
				}

			}
		))
		if(this.afterOpen) {
			this.afterOpenOriginal = this.afterOpen
		}
		if(this.data) {
			this.afterOpen = function(bodyElement, self) {
				bodyElement.innerHTML = formValueInjector(bodyElement.innerHTML, this.data)
				if(this.afterOpenOriginal) {
					this.afterOpenOriginal(bodyElement, self)
				}
			}
		}
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