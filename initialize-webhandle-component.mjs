import createInitializeWebhandleComponent from "@webhandle/initialize-webhandle-component/create-initialize-webhandle-component.mjs"
import ComponentManager from "@webhandle/initialize-webhandle-component/component-manager.mjs"
import path from "node:path"
import setupMaterialIcons from "@webhandle/material-icons/initialize-webhandle-component.mjs"
import setupDialog from "@webhandle/dialog/initialize-webhandle-component.mjs"
import kalpaTreeSetup from "kalpa-tree-on-page/initialize-webhandle-component.mjs"
import stylesSetup from "ei-form-styles-1/initialize-webhandle-component.mjs"

let initializeWebhandleComponent = createInitializeWebhandleComponent()

initializeWebhandleComponent.componentName = '@webhandle/tree-file-browser'
initializeWebhandleComponent.componentDir = import.meta.dirname
initializeWebhandleComponent.defaultConfig = {
	publicFilesPrefix: "/@webhandle/tree-file-browser/files"
	, provideResources: false
}

initializeWebhandleComponent.setup = async function(webhandle, config) {
	let manager = new ComponentManager()
	manager.config = config
	
	let managerMaterialIcons = await setupMaterialIcons(webhandle)
	let managerDialog = await setupDialog(webhandle)
	let kalpaTreeManager = await kalpaTreeSetup(webhandle)
	let stylesManager = await stylesSetup(webhandle)
	
	manager.addExternalResources = function(externalResourceManager) {
		manager.provideExternalResources(externalResourceManager)
	}

	manager.provideExternalResources = function(externalResourceManager) {

		let resource = {
			mimeType: 'application/javascript'
			, url: config.publicFilesPrefix + '/js/browser.js'
			, name: '@webhandle/tree-file-browser'
			, resourceType: 'module'
			, cachable: webhandle.development ? false : true
		}
		externalResourceManager.provideResource(resource)

		resource = {
			mimeType: 'application/javascript'
			, name: '@webhandle/tree-file-browser/configuration'
			, resourceType: 'module'
			, cachable: webhandle.development ? false : true
			, data: {publicFilesPrefix: config.publicFilesPrefix}
		}
		externalResourceManager.provideResource(resource)
	}
	
	if(config.provideResources) {
		webhandle.routers.preDynamic.use((req, res, next) => {
			manager.provideExternalResources(res.locals.externalResourceManager)
			next()
		})
	}

	let dir = 'public/tree-file-browser/resources'
	manager.staticPaths.push(
		webhandle.addStaticDir(
			path.join(initializeWebhandleComponent.componentDir, dir),
			{
				urlPrefix: config.publicFilesPrefix
				, fixedSetOfFiles: true
			}
		)
	)

	return manager
}

export default initializeWebhandleComponent
