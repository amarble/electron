const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let window;

function createWindow() {
	window = new BrowserWindow({ width: 800, height: 600, useContentSize: true });
	window.setMenu(null);
	
	window.loadURL(url.format({
		pathname: path.join(__dirname, '/dist/electron-angular/index.html'),
		protocol: 'file:',
		slashes: true
	}));
	
}

app.on('ready', createWindow);