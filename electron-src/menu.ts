import {
	BrowserWindow,
	BrowserView,
	ipcMain,
	Menu,
	safeStorage,
	shell,
} from 'electron';
import isDev from 'electron-is-dev';

import { gainGithubUser, gainGithubIssues } from './main';
import { store } from './utils/store';
import type { SettingData } from './preload/setting';

export const createMenu = ({
	parentWindow,
	webview,
	settingWindow,
	aboutWindow,
}: {
	parentWindow: BrowserWindow;
	settingWindow: BrowserWindow;
	aboutWindow: BrowserWindow;
	webview: BrowserView;
}): Menu => {
	const menu = Menu.buildFromTemplate([
		{
			label: 'Amethyst',
			submenu: [
				{
					label: 'About Amethyst',
					click: () => aboutWindow.show(),
				},
				{ type: 'separator' },
				{
					label: 'Preferences',
					accelerator: 'CmdOrCtrl+,',
					click: () => settingWindow.show(),
				},
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
			submenu: [{ role: 'close' }],
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
					submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
				},
			],
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: () => webview.webContents.reload(),
				},
				{
					label: 'Force Reload',
					accelerator: 'CmdOrCtrl+Shift+R',
					click: () => {
						parentWindow.reload();
						webview.webContents.reload();
					},
				},
				{
					label: 'Toggle Developer Tools',
					enabled: isDev,
					accelerator: 'CmdOrCtrl+Shift+I',
					click: (_menuItem, window) => {
						if (!window) {
							return;
						}

						if (window.webContents.isDevToolsOpened()) {
							window.webContents.closeDevTools();
						} else {
							window.webContents.openDevTools({ mode: 'detach' });
						}
					},
				},
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
				{ role: 'about' },
				{
					label: 'Learn More',
					click: () => {
						shell.openExternal('https://electronjs.org');
					},
				},
			],
		},
	]);

	ipcMain.handle('setting:display', async () => {
		return {
			baseUrl: store.get('githubSetting', {
				baseUrl: 'https://api.github.com/',
				token: '',
			}).baseUrl,
		};
	});
	ipcMain
		.on(
			'setting:submit',
			(_event: Electron.IpcMainEvent, data: SettingData) => {
				store.set('githubSetting', {
					baseUrl: data.baseUrl,
					token:
						data.token &&
						safeStorage.encryptString(data.token).toString('base64'),
				});
				settingWindow.hide();

				Promise.all([gainGithubUser(), gainGithubIssues()]);
			},
		)
		.on('setting:cancel', (_event: Electron.IpcMainEvent) => {
			settingWindow.hide();
		})
		.on('about:close', (_event: Electron.IpcMainEvent) => {
			aboutWindow.hide();
		});

	return menu;
};
