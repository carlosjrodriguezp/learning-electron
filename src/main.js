const electron = require('electron')
const path = require('path')

const countdown = require('./countdown.js')
const ipc = electron.ipcMain

//const app = electron.app
//const BrowserWindow = electron.BrowserWindow
//const Menu = electron.Menu

const {app, BrowserWindow, Menu, Tray, clipboard } = electron

const STACK_SIZE = 5
const ITEM_MAX_LENGTH = 20

function addToStack(item, stack) {
	return [item].concat(stack.length >= STACK_SIZE ? stack.slice(0, stack.length - 1) : stack)
}

function checkClipboardForChange(clipboard, onChange) {
	var cache = clipboard.readText()
	var latest
	setInterval(function() {
		latest = clipboard.readText()
		if(latest != cache){
			cache = latest
			onChange(cache)		
		}
	}, 1000)
}

function formatItem(item) {
	return item && item.length > ITEM_MAX_LENGTH ? item.substr(0, ITEM_MAX_LENGTH) + '...' : item
}

function formatMenuTemplateForStack(clipboard, stack) {
	return stack.map(function(item, i) {
		return {
			label: `Copy: ${formatItem(item)}`,
			click: function() {
				clipboard.writeText(item)
			}
		}
	})
}

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

	var stack = []

	checkClipboardForChange(clipboard, function(text) {
		stack = addToStack(text, stack)
		console.log("stack", stack)
		tray.setContextMenu(Menu.buildFromTemplate(formatMenuTemplateForStack(clipboard, stack)))
	})

})

ipc.on('countdown-start', function() {
	countdown(function(count) {
		windows.forEach(function(win) {
			win.webContents.send('countdown', count)
		})
	})
})
