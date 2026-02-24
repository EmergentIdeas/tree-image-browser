import {tripartite} from "tripartite"
import t3 from './webhandle-tree-image-browser/image-browser-frame.tri';
import t4 from './webhandle-tree-image-browser/variant-choice-box.tri'
import t5 from './webhandle-tree-image-browser/extension-pill.tri'
import t6 from './webhandle-tree-image-browser/guilded-image-upload-form.tri'
import t7 from './webhandle-tree-image-browser/guilded-file-upload-form.tri'

function add(item) {
	return tripartite.addTemplate(item.name, item.content)
}

export let imageBrowserFrame = add(t3)
export let variantChoiceBox = add(t4)
export let extensionPill = add(t5)
export let guidedImageUploadForm = add(t6)
export let guidedFileUploadForm = add(t7)
