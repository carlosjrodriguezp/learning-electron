const electron = require('electron')

const countdown = require('./countdown.js')
const ipc = electron.ipcMain

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

app.on('ready', function(){
	mainWindow = new BrowserWindow({
		height: 400,
		width: 400
	})
	console.log("It's ready!")

	mainWindow.loadURL(`file://${__dirname}/countdown.html`)

	mainWindow.on('closed', function(){
		console.log('closed')
		mainWindow = null
	})

	ipc.on('countdown-start', function() {
		countdown(function(count) {
			mainWindow.webContents.send('countdown', count)
		})
	})
})
