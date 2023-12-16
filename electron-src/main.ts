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
import * as windowUtils from './utils/window';

const isMac = process.platform === 'darwin';
let latestIssueGainTime: dayjs.Dayjs;

export const main = async () => {
	await prepareNext('./renderer');
	const userInfoProcess = gainGithubUser();
	const issuesProcess = gainGithubIssues(latestIssueGainTime);

	const mainWindow = windowUtils.createMain();
	const webview = windowUtils.createWebview();
	mainWindow.setBrowserView(webview);
	windowUtils.putWebview(mainWindow, webview);

	ipcMain.on('app:ready', (_event) => {
		log.verbose('App renderer is ready');
		userInfoProcess.then((userInfo) => {
			mainWindow.webContents.send('app:pushUser', userInfo);
		});
		issuesProcess.then((issues) => {
			mainWindow.webContents.send('app:pushIssues', issues);
		});
	});

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
			gainGithubIssues(latestIssueGainTime).then((issues) =>
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

const gainGithubUser = async () => await gainUserInfo();
const gainGithubIssues = async (prevTime?: dayjs.Dayjs) => {
	const now = dayjs();
	const issues = await gainIssues(
		now.subtract(githubAppSettings.terms.value, githubAppSettings.terms.unit),
	);
	if (
		prevTime &&
		issues.some((issue) => dayjs(issue.updatedAt).isAfter(prevTime))
	) {
		const notification = new Notification({
			title: 'Issueが更新されました',
			body: '更新されたIssue・PRがあります。Issue・PRを確認してください。',
		});
		notification.show();
	}
	latestIssueGainTime = now;
	return issues;
};
