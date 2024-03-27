import { Menu } from 'electron';
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
