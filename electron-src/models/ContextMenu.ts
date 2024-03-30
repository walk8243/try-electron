import { clipboard, Menu, shell } from 'electron';
import log from 'electron-log';
import { choiceIssueFilterFunction } from '@walk8243/amethyst-common';
import { store } from '../utils/store';
import type { IssueFilterTypes } from '../../types/IssueFilter';

export const createFilterMenu = (type: IssueFilterTypes): Menu => {
	const menu = Menu.buildFromTemplate([
		{
			label: '全て既読にする',
			click: () => {
				log.debug('context-menu-command', '全て既読にする', type);
				const { issues } = store.get('issueData', {
					updatedAt: '',
					issues: [],
				});
				const user = store.get('userInfo');
				issues
					.filter((issue) => choiceIssueFilterFunction(type)(issue, { user }))
					.forEach((issue) => {
						store.set(`issueSupplementMap.${issue.key}.isRead`, true);
					});
			},
		},
	]);
	return menu;
};

export const createWebviewMenu = (params: Electron.ContextMenuParams) => {
	const menu = Menu.buildFromTemplate([
		...(params.linkURL && params.linkText ? createLinkContextMenu(params) : []),
	]);
	return menu;
};

const createLinkContextMenu = (
	params: Electron.ContextMenuParams,
): Electron.MenuItemConstructorOptions[] => [
	{
		label: 'リンクをブラウザで開く',
		click: () => {
			log.debug(
				'webview-context-menu-command',
				'リンクをブラウザで開く',
				params.linkURL,
			);
			shell.openExternal(params.linkURL);
		},
	},
	{
		label: 'リンクURLをコピー',
		click: () => {
			log.debug(
				'webview-context-menu-command',
				'リンクURLをコピー',
				params.linkURL,
			);
			clipboard.writeText(params.linkURL);
		},
	},
	{
		label: 'リンクテキストをコピー',
		click: () => {
			log.debug(
				'webview-context-menu-command',
				'リンクテキストをコピー',
				params.linkText,
			);
			clipboard.writeText(params.linkText);
		},
	},
];
