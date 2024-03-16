import { Menu } from 'electron';
import log from 'electron-log';
import type { IssueFilterTypes } from '../../types/IssueFilter';

export const createFilterMenu = (type: IssueFilterTypes): Menu => {
	const menu = Menu.buildFromTemplate([
		{
			label: 'Menu Item 1',
			click: () => {
				log.debug('context-menu-command', 'menu-item-1', type);
			},
		},
		{ type: 'separator' },
		{ label: 'Menu Item 2', type: 'checkbox', checked: true },
	]);
	return menu;
};
