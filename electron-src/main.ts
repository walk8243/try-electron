import { join } from 'node:path';
import {
	app,
	BrowserView,
	BrowserWindow,
	clipboard,
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

import { gainGithubAllData, scheduledGainGithubIssues } from './github';
import { createMenu } from './menu';
import { checkStoreData } from './utils/github';
import { announceUpdate } from './utils/release';
import { getLoadedUrl } from './utils/render';
import { store } from './utils/store';
import * as windowUtils from './utils/window';
import type { Issue } from '../types/Issue';

export const main = async () => {
	const mainWindow = setupMainWindow();
	const storeDataFlag = checkStoreData();

	await prepareNext('./renderer');
	mainWindow.loadURL(getLoadedUrl());
	if (!storeDataFlag.isInvalid()) {
		gainGithubAllData(true);
	}

	const webview = setupWebview(mainWindow);
	const { updateWindow } = setupModalWindow(
		mainWindow,
		webview,
		storeDataFlag.isInvalid(),
	);
	setupResizedSetting(mainWindow, webview);

	scheduledGainGithubIssues();
	await announceUpdate(updateWindow, false);
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
		if (store.has('issueSupplementMap')) {
			mainWindow.webContents.send(
				'app:pushIssueSupplementMap',
				store.get('issueSupplementMap'),
			);
		}

		store.onDidChange('userInfo', (userInfo) => {
			log.debug('蓄積しているUserInfoが更新されました');
			mainWindow.webContents.send('app:pushUser', userInfo ?? {});
		});
		store.onDidChange('issueData', (data) => {
			log.verbose('蓄積しているIssueDataが更新されました');
			if (!data) return;
			mainWindow.webContents.send('app:pushUpdatedAt', data.updatedAt);
			mainWindow.webContents.send('app:pushIssues', data.issues ?? []);
		});
		store.onDidChange('issueSupplementMap', (map) => {
			log.debug('蓄積しているIssueの追加データが更新されました');
			if (!map) return;
			mainWindow.webContents.send('app:pushIssueSupplementMap', map);
		});
	});

	return mainWindow;
};
const setupWebview = (mainWindow: BrowserWindow) => {
	const webview = windowUtils.createWebview();
	mainWindow.setBrowserView(webview);
	windowUtils.putWebview(mainWindow, webview);
	ipcMain.handle('github:issue', async (_event, issue: Issue) => {
		store.set(`issueSupplementMap.${issue.key}.isRead`, true);
		webview.webContents.loadURL(issue.url);
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
	const updateWindow = windowUtils.createUpdate(mainWindow);
	const menu = createMenu({
		webview,
		settingWindow,
		aboutWindow,
		updateWindow,
	});
	Menu.setApplicationMenu(menu);
	mainWindow.show();

	if (settingShowFlag) {
		settingWindow.show();
	}

	return {
		settingWindow,
		aboutWindow,
		updateWindow,
	};
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
const setupDevtools = async () => {
	if (isDev) {
		await installExtension(REACT_DEVELOPER_TOOLS);
		await session.defaultSession.loadExtension(
			join(app.getPath('userData'), 'extensions', REACT_DEVELOPER_TOOLS.id),
		);
	}
};
