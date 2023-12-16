import { join } from 'node:path'
import { BrowserWindow, BrowserView } from 'electron'
import { getLoadedUrl } from './render'

const isMac = process.platform === 'darwin' as const

export const createMain = () => {
	const mainWindow = new BrowserWindow({
		width: 1500,
		height: 800,
		show: false,
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
		resizable: false,
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
		width: 500,
		height: 670 + (isMac ? 0 : 27),
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
	webview.webContents.loadURL('https://github.com/')

	return webview
}

const boundPosition = { x: 600, y: 24 } as const
export const putWebview = (mainWindow: BrowserWindow, webview: BrowserView, { noHeaderFlag }: { noHeaderFlag?: boolean } = {}) => {
	const bounds = mainWindow.getBounds()
	const option = { isNoHeader: noHeaderFlag === true, isMac }
	const boundsPlan = { x: boundPosition.x, y: boundPosition.y, width: calcWebviewWidth(bounds, option), height: calcWebviewHeight(bounds, option) }
	webview.setBounds(boundsPlan)
}
const calcWebviewWidth = (mainWindowBounds: Electron.Rectangle, option: { isNoHeader: boolean, isMac: boolean }) => {
	let width = mainWindowBounds.width - boundPosition.x
	if (!option.isMac) {
		width -= 16
	}
	return width
}
const calcWebviewHeight = (mainWindowBounds: Electron.Rectangle, option: { isNoHeader: boolean, isMac: boolean }) => {
	let height = mainWindowBounds.height - boundPosition.y
	if (option.isNoHeader) {
		return height
	}
	return height - (option.isMac ? 27 : 59)
}
