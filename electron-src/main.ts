import { join } from 'node:path';
import {
	app,
	BrowserView,
	BrowserWindow,
	clipboard,
	dialog,
	ipcMain,
	Menu,
	session,
	shell,
} from 'electron';
import prepareNext from 'electron-next';
import isDev from 'electron-is-dev';
import log from 'electron-log/main';
import installExtension, {
	REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';

import { checkUpdate, gainGithubAllData, gainGithubIssues } from './github';
import { createMenu } from './menu';
import { checkStoreData } from './utils/github';
import { getLoadedUrl } from './utils/render';
import { store } from './utils/store';
import * as windowUtils from './utils/window';

const IssueGainInterval = 300000 as const; // 5分

export const main = async () => {
	const mainWindow = setupMainWindow();
	const storeDataFlag = checkStoreData();

	await prepareNext('./renderer');
	mainWindow.loadURL(getLoadedUrl());
	if (!storeDataFlag.isInvalid()) {
		gainGithubAllData(true);
	}

	const webview = setupWebview(mainWindow);
	setupModalWindow(mainWindow, webview, storeDataFlag.isInvalid());
	setupResizedSetting(mainWindow, webview);

	setInterval(() => {
		gainGithubIssues();
	}, IssueGainInterval);

	await announceUpdate(mainWindow);
	await setupDevtools();
};

const setupMainWindow = () => {
	const mainWindow = windowUtils.createMain();
	ipcMain.handle('app:version', () => `v${app.getVersion()}`);
	ipcMain.on('app:ready', (_event) => {
		log.verbose('App renderer is ready');

		if (store.has('userInfo')) {
			mainWindow.webContents.send('app:pushUser', store.get('userInfo'));
		}
		if (store.has('issueData')) {
			mainWindow.webContents.send(
				'app:pushIssues',
				store.get('issueData')?.issues ?? [],
			);
			mainWindow.webContents.send(
				'app:pushUpdatedAt',
				store.get('issueData')?.updatedAt ?? '',
			);
		}

		store.onDidChange('userInfo', (userInfo) => {
			mainWindow.webContents.send('app:pushUser', userInfo ?? {});
		});
		store.onDidChange('issueData', (data) => {
			log.debug('蓄積しているデータが更新されました');
			if (!data) return;
			mainWindow.webContents.send('app:pushUpdatedAt', data.updatedAt);
			mainWindow.webContents.send('app:pushIssues', data.issues ?? []);
		});
	});

	return mainWindow;
};
const setupWebview = (mainWindow: BrowserWindow) => {
	const webview = windowUtils.createWebview();
	mainWindow.setBrowserView(webview);
	windowUtils.putWebview(mainWindow, webview);
	ipcMain.handle('github:issue', async (_event, url: string) => {
		webview.webContents.loadURL(url);
	});
	ipcMain.on('browser:open', (_event, url: string) => {
		shell.openExternal(url);
	});
	ipcMain.handle('browser:reload', (_event) => {
		webview.webContents.reload();
	});
	ipcMain.handle('browser:history', (_event, ope: 'back' | 'forward') => {
		if (ope === 'back') {
			webview.webContents.goBack();
		}
		if (ope === 'forward') {
			webview.webContents.goForward();
		}

		return {
			canGoBack: webview.webContents.canGoBack(),
			canGoForward: webview.webContents.canGoForward(),
		};
	});
	ipcMain.on('browser:copy', (_event, url: string) => {
		clipboard.writeText(url);
	});
	ipcMain.handle(
		'browser:search',
		async (_event, query: string, direction: 'next' | 'back') => {
			if (!query) {
				webview.webContents.stopFindInPage('clearSelection');
				return;
			}
			webview.webContents.findInPage(query, { forward: direction === 'next' });
		},
	);

	webview.webContents.on('did-finish-load', () => {
		mainWindow.webContents.send('browser:load', {
			url: webview.webContents.getURL(),
			canGoBack: webview.webContents.canGoBack(),
			canGoForward: webview.webContents.canGoForward(),
		});
	});
	return webview;
};
const setupModalWindow = (
	mainWindow: BrowserWindow,
	webview: BrowserView,
	settingShowFlag: boolean,
) => {
	const settingWindow = windowUtils.createSetting(mainWindow);
	const aboutWindow = windowUtils.createAbout(mainWindow);
	const menu = createMenu({
		webview,
		settingWindow,
		aboutWindow,
	});
	Menu.setApplicationMenu(menu);
	mainWindow.show();

	if (settingShowFlag) {
		settingWindow.show();
	}
};
const setupResizedSetting = (
	mainWindow: BrowserWindow,
	webview: BrowserView,
) => {
	mainWindow
		.on('maximize', () => {
			windowUtils.putWebview(mainWindow, webview);
		})
		.on('unmaximize', () => {
			windowUtils.putWebview(mainWindow, webview);
		})
		.on('resized', () => {
			windowUtils.putWebview(mainWindow, webview);
		})
		.on('enter-full-screen', () => {
			windowUtils.putWebview(mainWindow, webview, { noHeaderFlag: true });
		})
		.on('leave-full-screen', () => {
			windowUtils.putWebview(mainWindow, webview);
		});
};
const announceUpdate = async (mainWindow: BrowserWindow) => {
	if (!(await checkUpdate())) return;

	setImmediate(() => {
		dialog.showMessageBox(mainWindow, {
			title: '最新のリリースがあります',
			message: 'アップデートして最新の機能を体験してください。',
		});
	});
};
const setupDevtools = async () => {
	if (isDev) {
		await installExtension(REACT_DEVELOPER_TOOLS);
		await session.defaultSession.loadExtension(
			join(app.getPath('userData'), 'extensions', REACT_DEVELOPER_TOOLS.id),
		);
	}
};
