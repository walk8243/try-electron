import { BrowserView, BrowserWindow, dialog } from 'electron';
import log from 'electron-log/main';

const CREATE_ISSUE_URL =
	'https://github.com/walk8243/amethyst-electron/issues/new?template=bug_report.md&labels=bug';

export const handleErrorDisplay = ({
	error,
	mainWindow,
	webview,
}: {
	error: Error;
	mainWindow: BrowserWindow;
	webview: BrowserView;
}) => {
	log.error(`${error.name}: ${error.message}`);
	sendError(error, mainWindow);
	viewReportIssue(webview);
	showErrorDialog(mainWindow);
};
const sendError = (error: Error, mainWindow: BrowserWindow) => {
	mainWindow.webContents.send('error:show', error);
};
const viewReportIssue = (webview: BrowserView) => {
	webview.webContents.loadURL(CREATE_ISSUE_URL);
};
const showErrorDialog = (mainWindow: BrowserWindow) => {
	dialog.showMessageBox(mainWindow, {
		title: 'エラーが発生しました',
		message: 'エラー内容のご報告にご協力をどうかお願い致します。',
		type: 'error',
	});
};
