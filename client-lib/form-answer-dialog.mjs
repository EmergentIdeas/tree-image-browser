import Dialog from 'ei-dialog'
import formValueInjector from 'form-value-injector'
import gatherFormData from '@webhandle/gather-form-data'


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
						this.resolve(this.gatherData())
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
		if (this.afterOpen) {
			this.afterOpenOriginal = this.afterOpen
		}
		this.afterOpen = function (bodyElement, self) {
			if (this.data) {
				bodyElement.innerHTML = formValueInjector(bodyElement.innerHTML, this.data)
			}
			let firstInput = bodyElement.querySelector('input, textarea')
			if (firstInput) {
				firstInput.focus()
			}

			if (this.afterOpenOriginal) {
				this.afterOpenOriginal(bodyElement, self)
			}
		}
	}
	gatherData() {
		let dialogBody = document.querySelector(this.getBodySelector())
		return gatherFormData(dialogBody)
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