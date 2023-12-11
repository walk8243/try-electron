import { join } from 'node:path'
import { BrowserWindow, BrowserView, ipcMain, Menu, MenuItem, safeStorage } from 'electron'
import isDev from 'electron-is-dev'
import type { BrowserWindowConstructorOptions } from 'electron'

import { store } from './utils/store'
import { getLoadedUrl } from './utils/render'
import type { SettingData } from './preload/setting'

export const createMenu = (parentWindow: BrowserWindow, webview: BrowserView): Menu => {
	const menu = new Menu()

	const fileMenu = new Menu()
	const settingWindow = new BrowserWindow({ ...SettingsWindowOptions, parent: parentWindow })
	settingWindow.removeMenu()
	settingWindow.loadURL(getLoadedUrl('setting'))
	fileMenu.append(new MenuItem({
		label: 'Settings',
		click: () => settingWindow.show(),
	}))
	menu.append(new MenuItem({
		label: 'File',
		submenu: fileMenu,
	}))

	const editMenu = new Menu()
	editMenu.append(new MenuItem({
		label: 'Reload',
		role: 'reload',
		accelerator: 'CmdOrCtrl+R',
		click: () => webview.webContents.reload(),
	}))
	editMenu.append(new MenuItem({
		label: 'Full Reload',
		accelerator: 'CmdOrCtrl+Shift+R',
		click: () => {
			parentWindow.reload()
			webview.webContents.reload()
		},
	}))
	menu.append(new MenuItem({
		label: 'Edit',
		submenu: editMenu,
	}))

	if (isDev) {
		const devMenu = new Menu()
		devMenu.append(new MenuItem({
			label: 'Toggle Developer Tools',
			accelerator: 'CmdOrCtrl+Alt+I',
			click: (_menuItem, window) => {
				if (!window) return
				if (window.webContents.isDevToolsOpened()) {
					window.webContents.closeDevTools()
				} else {
					window.webContents.openDevTools({ mode: 'detach' })
				}
			},
		}))
		menu.append(new MenuItem({
			label: 'Developer',
			submenu: devMenu,
		}))
	}

	const helpMenu = new Menu()
	const helpWindow = new BrowserWindow({ ...AboutWindowOptions, parent: parentWindow })
	helpWindow.removeMenu()
	helpWindow.loadURL(getLoadedUrl('about'))
	helpMenu.append(new MenuItem({
		label: 'About',
		click: () => helpWindow.show(),
	}))
	menu.append(new MenuItem({
		label: 'Help',
		submenu: helpMenu,
	}))

	ipcMain.handle('setting:display', async () => {
		return { hostname: store.get('githubHostname') }
	})
	ipcMain
		.on('submit', (_event: Electron.IpcMainEvent, data: SettingData) => {
			store.set('githubHostname', data.hostname)
			if (data.token) {
				store.set('githubToken', safeStorage.encryptString(data.token).toString('base64'))
			}
			settingWindow.hide()
			parentWindow.reload()
		})
		.on('cancel', (_event: Electron.IpcMainEvent) => {
			settingWindow.hide()
		})

	return menu
}

const SettingsWindowOptions: BrowserWindowConstructorOptions = {
	title: 'Settings',
	parent: undefined, // set in createMenu
	modal: true,
	width: 300,
	height: 500,
	show: false,
	closable: false,
	fullscreenable: false,
	webPreferences: {
		nodeIntegration: false,
		contextIsolation: true,
		preload: join(__dirname, 'preload', 'setting.js'),
	},
}
const AboutWindowOptions: BrowserWindowConstructorOptions = {
	title: 'About',
	parent: undefined, // set in createMenu
	modal: true,
	width: 300,
	height: 200,
	show: false,
	resizable: false,
	fullscreenable: false,
}
