import { BrowserWindow, BrowserView, ipcMain, Menu, MenuItem, safeStorage } from 'electron'
import isDev from 'electron-is-dev'

import { store } from './utils/store'
import type { SettingData } from './preload/setting'

export const createMenu = ({ parentWindow, webview, settingWindow, aboutWindow }: { parentWindow: BrowserWindow, settingWindow: BrowserWindow, aboutWindow: BrowserWindow, webview: BrowserView }): Menu => {
	const menu = new Menu()

	const fileMenu = new Menu()
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
	helpMenu.append(new MenuItem({
		label: 'About',
		click: () => aboutWindow.show(),
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
