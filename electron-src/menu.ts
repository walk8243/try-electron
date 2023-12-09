import { join } from 'node:path'
import { BrowserWindow, ipcMain, Menu, MenuItem, safeStorage } from 'electron'
import type { BrowserWindowConstructorOptions } from 'electron'

import { store } from './utils/store'
import { getLoadedUrl } from './utils/render'
import type { SettingData } from './preload/setting'

export const createMenu = (parentWindow: BrowserWindow) => {
	const menu = new Menu()

	const fileMenu = new Menu()
	fileMenu.append(new MenuItem({
		label: 'New',
		click: () => console.log('New File'),
	}))
	const settingWindow = new BrowserWindow({ ...SettingsWindowOptions, parent: parentWindow })
	settingWindow.loadURL(getLoadedUrl('setting'))
	fileMenu.append(new MenuItem({
		label: 'Settings',
		click: () => settingWindow.show(),
	}))
	menu.append(new MenuItem({
		label: 'File',
		submenu: fileMenu,
	}))

	Menu.setApplicationMenu(menu)

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
