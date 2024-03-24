import FileSinkRemoteHTTP from 'file-sink-remote-http'

export default function sinkSetup() {
	let webhandle = window.webhandle = window.webhandle || {}

	webhandle.sinks = webhandle.sinks || {}
	webhandle.sinks.files = new FileSinkRemoteHTTP('/files')
	webhandle.sinks.public = webhandle.sinks.files

}

