const electron = require('electron')

const countdown = require('./countdown.js')
const ipc = electron.ipcMain

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const windows = []

app.on('ready', function() {
	[1,2,3].forEach(function() {
		var win = new BrowserWindow({
			height: 400,
			width: 400
		})
		console.log("It's ready!")

		win.loadURL(`file://${__dirname}/countdown.html`)

		win.on('closed', function(){
			console.log('closed')
			win = null
		})

		windows.push(win)
	})
})

ipc.on('countdown-start', function() {
	countdown(function(count) {
		windows.forEach(function(win) {
			win.webContents.send('countdown', count)
		})
	})
})
