const electron = require('electron')
const path = require('path')
const fs = require('fs')

//const ipc = electron.ipcRenderer
const {ipcRenderer:ipc, desktopCapturer, screen} = electron

function getMainSource(desktopCapturer, screen, done) {
	const options = {
		types: ['screen'],
		thumbnailSize: screen.getPrimaryDisplay().workAreaSize
	}
	desktopCapturer.getSources(options, function(err, sources) {
		if(err)
			return console.log('Cannot capture screen: ' + err)
		const isMainSource = function(source) {
			return source.name === 'Entire screen' || source.name === 'Screen 1'
		}
		//const isMainSource = source => source.name === 'Entire screen' || source.name === 'Screen 1'
		console.log("HERE "+sources.filter(isMainSource)[0])
		done(sources.filter(isMainSource)[0])
	})
}

function onCapture(evt, targetPath) {
	getMainSource(desktopCapturer, screen, function(source) {
		const png = source.thumbnail.toPng()
		const filePath = path.join(targetPath, 'Name.png')
		writeScreenShot(png, filePath)
	})
	console.log("captured!")
}

function writeScreenShot(png, filePath) {
	fs.writeFile(filePath, png, function(err) {
		if(err)
			return console.log('Failed to save screenshot: ' + err)
	})
}

ipc.on('capture', onCapture)