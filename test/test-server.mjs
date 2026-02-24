import setup from "../initialize-webhandle-component.mjs"
import FileSinkServer from 'file-sink-server'
import FileSink from 'file-sink'
import fileSinkRemoteHttpSetup from "file-sink-remote-http/initialize-webhandle-component.mjs"

export default async function setupServer(webhandle) {
	webhandle.development = true
	await setup(webhandle)
	let fileSinkRemoteHttpManager = await fileSinkRemoteHttpSetup(webhandle)

	let router = webhandle.createRouter()
	// let sinkServer = new FileSinkServer(new FileSink(webhandle.projectRoot + '/public'))
	let sinkServer = new FileSinkServer(new FileSink('/home/kolz/data/test-data/image-files'))
	// let sinkServer = new FileSinkServer(new FileSink('/home/kolz/personal-data/dmusic'))
	sinkServer.addToRouter(router)
	webhandle.routers.primary.use('/files', router)
}



