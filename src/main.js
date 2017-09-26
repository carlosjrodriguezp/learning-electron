const electron = require('electron')
const path = require('path')

const countdown = require('./countdown.js')
const ipc = electron.ipcMain

//const app = electron.app
//const BrowserWindow = electron.BrowserWindow
//const Menu = electron.Menu

const {app, BrowserWindow, Menu, Tray } = electron

const windows = []

app.on('ready', function() {
	[1].forEach(function() {
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

	var name = electron.app.getName()
	const template = [{
		label: name,
		submenu: [{
			label: 'First Element',
			click: function() {
				console.log('clicked First Element')
			}
		}, {
			label: `About ${name}`,
			click: function() {
				console.log('clicked about')
			},
			role: 'about'
		}, {
			type: 'separator'
		}, {
			label: 'Quit',
			click: function() {
				app.quit()
			},
			accelerator: 'Ctrl+Q'

		}]
	}]

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	const tray = new Tray(path.join('src','my_icon.png'))

	tray.setContextMenu(menu)
	tray.setToolTip(name)

})

ipc.on('countdown-start', function() {
	countdown(function(count) {
		windows.forEach(function(win) {
			win.webContents.send('countdown', count)
		})
	})
})
