const electron = require('electron')
const ipc = electron.ipcRenderer

document.getElementById('start').addEventListener('click', function() {
	ipc.send('countdown-start')
})

ipc.on('countdown', function(evt, count) {
	console.log("FROM RENDERER " + count)
	document.getElementById('count').innerHTML = count
})