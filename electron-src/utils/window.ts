import { join } from 'node:path'
import { BrowserWindow, BrowserView } from 'electron'
import { getLoadedUrl } from './render'

const isMac = process.platform === 'darwin'

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
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: join(__dirname, '../preload', 'about.js'),
		},
	})
	aboutWindow.removeMenu()
	aboutWindow.loadURL(getLoadedUrl('about'))

	return aboutWindow
}

export const createWebview = () => {
	const webview = new BrowserView({})
	webview.setBounds({ x: 550, y: 24, width: 1200 - (isMac ? 0 : 6) - 550, height: 800 - (isMac ? 27 : 49) - 24 - 24 })
	webview.webContents.loadURL('https://github.com/')

	return webview
}
