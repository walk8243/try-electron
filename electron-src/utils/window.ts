import { join } from 'node:path'
import { BrowserWindow, BrowserView } from 'electron'
import { getLoadedUrl } from './render'

export const createMain = () => {
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		show: false,
		resizable: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: join(__dirname, '../preload', 'main.js'),
		},
	})
	mainWindow.loadURL(getLoadedUrl())

	return mainWindow
}

export const createSetting = (parentWindow: BrowserWindow) => {
	const settingWindow = new BrowserWindow({
		title: 'Settings',
		parent: parentWindow,
		modal: true,
		width: 300,
		height: 500,
		show: false,
		closable: false,
		fullscreenable: false,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: join(__dirname, '../preload', 'setting.js'),
		},
	})
	settingWindow.removeMenu()
	settingWindow.loadURL(getLoadedUrl('setting'))

	return settingWindow
}

export const createAbout = (parentWindow: BrowserWindow) => {
	const aboutWindow = new BrowserWindow({
		title: 'About',
		parent: parentWindow,
		modal: true,
		width: 300,
		height: 200,
		show: false,
		resizable: false,
		fullscreenable: false,
	})
	aboutWindow.removeMenu()
	aboutWindow.loadURL(getLoadedUrl('about'))

	return aboutWindow
}

export const createWebview = () => {
	const webview = new BrowserView({})
	webview.setBounds({ x: 550, y: 24, width: 1200 - 6 - 250 - 300, height: 800 - 49 - 24 - 24 })
	webview.webContents.loadURL('https://github.com/')

	return webview
}
