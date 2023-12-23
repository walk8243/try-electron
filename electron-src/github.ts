import { app, dialog, ipcMain, Notification } from 'electron';
import log from 'electron-log/main';
import dayjs from 'dayjs';
import semver from 'semver';
import {
	gainUserInfo,
	gainIssues,
	githubAppSettings,
	viewLatestRelease,
} from './utils/github';
import { store } from './utils/store';

let latestIssueGainTime: dayjs.Dayjs | null = null;

export const gainGithubAllData = async (isBoot: boolean) => {
	log.debug('main.gainGithubAllData を実行します');
	try {
		await Promise.all([gainGithubUser(), gainGithubIssues()]);
	} catch (error) {
		log.error(
			new Error('GitHub APIからのデータ取得に失敗しました', { cause: error }),
		);
		if (isBoot) {
			ipcMain.once('app:ready', () => {
				showErrorDialog();
			});
		} else {
			showErrorDialog();
		}
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

export const checkUpdate = async () => {
	const latestRelease = await viewLatestRelease();
	const currentVersion = app.getVersion();
	log.verbose('versions:', {
		appVersion: currentVersion,
		latestRelease: latestRelease.tag,
	});
	return semver.gt(latestRelease.tag, currentVersion);
};

const showErrorDialog = () => {
	dialog.showErrorBox(
		'GitHub APIからのデータ取得に失敗しました',
		'tokenの有効期限が切れている可能性があります。設定画面からtokenを再設定してください。',
	);
	app.applicationMenu?.items
		.find((item) => item.label === 'Amethyst')
		?.submenu?.items.find((item) => item.label === 'Preferences')
		?.click();
};
