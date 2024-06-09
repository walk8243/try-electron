import { clipboard, Menu, shell } from 'electron';
import log from 'electron-log';
import { choiceIssueFilterFunction } from '@walk8243/amethyst-common';
import { store, removeIssue } from '../utils/store';
import { Issue } from '../../types/Issue';
import type { IssueFilterTypes } from '../../types/IssueFilter';

export const createFilterMenu = (type: IssueFilterTypes) => {
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
				const readIssues = Object.entries(store.get('issueSupplementMap', {}))
					.filter(([_key, value]) => value.isRead)
					.map(([key, _value]) => key);
				issues
					.filter((issue) => choiceIssueFilterFunction(type)(issue, { user }))
					.filter((issue) => !readIssues.includes(issue.key))
					.forEach((issue) => {
						store.set(`issueSupplementMap.${issue.key}.isRead`, true);
					});
			},
		},
	]);
	return menu;
};

export const createIssueCardMenu = (issue: Issue) => {
	const menu = Menu.buildFromTemplate([
		{
			label: '既読にする',
			click: () => {
				log.debug(
					'context-menu-command',
					'既読にする',
					`${issue.repositoryName}#${issue.number}`,
				);
				store.set(`issueSupplementMap.${issue.key}.isRead`, true);
			},
		},
		{
			label: '非表示にする',
			click: () => {
				log.debug(
					'context-menu-command',
					'非表示にする',
					`${issue.repositoryName}#${issue.number}`,
				);
				removeIssue(issue);
			},
		},
	]);
	return menu;
};

export const createWebviewMenu = (params: Electron.ContextMenuParams) => {
	const menu = Menu.buildFromTemplate([
		...(params.linkURL && params.linkText
			? createLinkContextMenu(params)
			: [
					{
						label: 'このページをブラウザで開く',
						click: () => {
							log.debug(
								'webview-context-menu-command',
								'このページをブラウザで開く',
								params.pageURL,
							);
							shell.openExternal(params.pageURL);
						},
					},
				]),
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
		type: 'separator',
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
