import { app, BrowserWindow, BrowserView, ipcMain, Menu, MenuItem, safeStorage, shell } from 'electron'
import isDev from 'electron-is-dev'

import { store } from './utils/store'
import type { SettingData } from './preload/setting'

export const createMenu = ({ parentWindow, webview, settingWindow, aboutWindow }: { parentWindow: BrowserWindow, settingWindow: BrowserWindow, aboutWindow: BrowserWindow, webview: BrowserView }): Menu => {
	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [
				{ role: 'about' },
				{ type: 'separator' },
				{ role: 'services' },
				{ type: 'separator' },
				{ role: 'hide' },
				{ role: 'hideOthers' },
				{ role: 'unhide' },
				{ type: 'separator' },
				{ role: 'quit' },
			],
		},
		{
			label: 'File',
			submenu: [
				{ role: 'close' },
			],
		},
		{
			label: 'Edit',
			submenu: [
				{ role: 'undo' },
				{ role: 'redo' },
				{ type: 'separator' },
				{ role: 'cut' },
				{ role: 'copy' },
				{ role: 'paste' },
				{ role: 'pasteAndMatchStyle' },
				{ role: 'delete' },
				{ role: 'selectAll' },
				{ type: 'separator' },
				{
					label: 'Speech',
					submenu: [
						{ role: 'startSpeaking' },
						{ role: 'stopSpeaking' },
					],
				},
			],
		},
		{
			label: 'View',
			submenu: [
				{ role: 'reload' },
				{ role: 'forceReload' },
				{ role: 'toggleDevTools' },
				{ type: 'separator' },
				{ role: 'resetZoom' },
				{ role: 'zoomIn' },
				{ role: 'zoomOut' },
				{ type: 'separator' },
				{ role: 'togglefullscreen' },
			],
		},
		{
			label: 'Window',
			submenu: [
				{ role: 'minimize' },
				{ role: 'zoom' },
				{ type: 'separator' },
				{ role: 'front' },
				{ type: 'separator' },
				{ role: 'window' },
				{ role: 'close' },
			],
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click: () => { shell.openExternal('https://electronjs.org') },
				},
			],
		},
	])

	const fileMenu = new Menu()
	fileMenu.append(new MenuItem({
		label: 'Settings',
		accelerator: 'CmdOrCtrl+,',
		click: () => settingWindow.show(),
	}))
	menu.append(new MenuItem({
		label: 'ORIGIN1',
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
		label: 'ORIGIN2',
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
			label: 'ORIGIN3',
			submenu: devMenu,
		}))
	}

	const helpMenu = new Menu()
	helpMenu.append(new MenuItem({
		label: 'About',
		click: () => aboutWindow.show(),
	}))
	menu.append(new MenuItem({
		label: 'ORIGIN4',
		submenu: helpMenu,
	}))

	ipcMain.handle('setting:display', async () => {
		return { baseUrl: store.get('githubBaseUrl') }
	})
	ipcMain
		.on('submit', (_event: Electron.IpcMainEvent, data: SettingData) => {
			store.set('githubBaseUrl', data.baseUrl)
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
