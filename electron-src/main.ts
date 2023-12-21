import { join } from 'node:path';
import { app, ipcMain, Menu, Notification, session, shell } from 'electron';
import prepareNext from 'electron-next';
import isDev from 'electron-is-dev';
import log from 'electron-log/main';
import installExtension, {
	REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import dayjs from 'dayjs';

import { createMenu } from './menu';
import {
	gainUserInfo,
	gainIssues,
	checkStoreData,
	githubAppSettings,
} from './utils/github';
import { getLoadedUrl } from './utils/render';
import { store } from './utils/store';
import * as windowUtils from './utils/window';

const isMac = process.platform === 'darwin';
let latestIssueGainTime: dayjs.Dayjs | null = null;

export const main = async () => {
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
			mainWindow.webContents.send('app:pushUpdatedAt', data.updatedAt ?? {});
			mainWindow.webContents.send('app:pushIssues', data.issues ?? []);
		});
	});

	await prepareNext('./renderer');
	mainWindow.loadURL(getLoadedUrl());
	gainGithubUser().catch((_err) => {});
	gainGithubIssues().catch((_err) => {});

	const webview = windowUtils.createWebview();
	mainWindow.setBrowserView(webview);
	windowUtils.putWebview(mainWindow, webview);

	const settingWindow = windowUtils.createSetting(mainWindow);
	const aboutWindow = windowUtils.createAbout(mainWindow);
	const menu = createMenu({
		parentWindow: mainWindow,
		webview,
		settingWindow,
		aboutWindow,
	});
	if (isMac) {
		Menu.setApplicationMenu(menu);
	} else {
		mainWindow.setMenu(menu);
	}
	mainWindow.show();

	ipcMain.handle('github:issue', async (_event, url: string) => {
		webview.webContents.loadURL(url);
	});
	ipcMain.on('browser:open', (_event, url: string) => {
		shell.openExternal(url);
	});

	if (!checkStoreData()) {
		settingWindow.show();
	}

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

	setInterval(
		() => {
			gainGithubIssues().then((issues) =>
				mainWindow.webContents.send('app:pushIssues', issues),
			);
		},
		5 * 60 * 1000,
	);

	if (isDev) {
		await installExtension(REACT_DEVELOPER_TOOLS);
		await session.defaultSession.loadExtension(
			join(app.getPath('userData'), 'extensions', REACT_DEVELOPER_TOOLS.id),
		);
	}
};

export const gainGithubUser = async () => {
	log.debug('main.gainGithubUser を実行します');
	const userInfo = await gainUserInfo();

	store.set('userInfo', userInfo);
	return userInfo;
};
export const gainGithubIssues = async () => {
	log.debug('main.gainGithubIssues を実行します');
	const now = dayjs();
	const issues = await gainIssues(
		now.subtract(githubAppSettings.terms.value, githubAppSettings.terms.unit),
	);

	if (
		latestIssueGainTime &&
		issues.some((issue) => dayjs(issue.updatedAt).isAfter(latestIssueGainTime))
	) {
		const notification = new Notification({
			title: 'Issueが更新されました',
			body: '更新されたIssue・PRがあります。Issue・PRを確認してください。',
		});
		notification.show();
	}
	latestIssueGainTime = now;

	store.set('issueData', { updatedAt: now.toISOString(), issues });
	return issues;
};
