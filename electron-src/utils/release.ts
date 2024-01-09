import { app, BrowserWindow, ipcMain, net, shell } from 'electron';
import log from 'electron-log/main';
import semver from 'semver';
import type { Release } from '../types/Walk8243';
import type { UpdateStatus } from '../../types/Update';

const latestReleaseUrl =
	'https://walk8243.xyz/api/release?repository=amethyst-electron' as const;

export const announceUpdate = async (
	updateWindow: BrowserWindow,
	isForceShow: boolean = true,
) => {
	const result = await checkUpdate();

	ipcMain.removeHandler('update:version');
	ipcMain.handle('update:version', (_event) => result);

	ipcMain.removeAllListeners('update:download');
	ipcMain.removeAllListeners('update:openRelease');
	ipcMain.on('update:download', () => {
		log.debug('[update:download] MSIファイルのダウンロードを開始します');
		updateWindow.webContents.downloadURL(
			`https://github.com/walk8243/amethyst-electron/releases/download/${result.latestRelease}/amethyst-${result.latestRelease}-win.msi`,
		);
	});
	ipcMain.on('update:openRelease', () => {
		log.debug('[update:openRelease] リリースページを開きます');
		shell.openExternal(
			`https://github.com/walk8243/amethyst-electron/releases/tag/${result.latestRelease}`,
		);
	});

	if (!isForceShow && !result.canUpdate) return;
	setImmediate(() => {
		updateWindow.show();
	});
};

const checkUpdate = async (): Promise<UpdateStatus> => {
	const latestRelease = await gainLatestRelease();
	const currentVersion = app.getVersion();
	log.verbose('versions:', {
		appVersion: currentVersion,
		latestRelease: latestRelease.tag,
	});
	return {
		canUpdate: semver.gt(latestRelease.tag, currentVersion),
		appVersion: currentVersion,
		latestRelease: latestRelease.tag,
	};
};

const gainLatestRelease = async () => {
	const res = await net.fetch(latestReleaseUrl);
	const json = await res.json();
	if (!isReleaseType(json)) {
		throw new Error('最新リリースのresponseが異常値です');
	}
	return json;
};

const isReleaseType = (target: unknown): target is Release => {
	if (target === null || typeof target !== 'object') {
		return false;
	}
	return (
		'key' in target && 'tag' in target && 'title' in target && 'url' in target
	);
};
