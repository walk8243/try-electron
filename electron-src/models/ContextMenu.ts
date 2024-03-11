import { Menu } from 'electron';

export const createContextMenu = (window: Electron.BrowserWindow): Menu => {
	const menu = Menu.buildFromTemplate([
		{
			label: 'Menu Item 1',
			click: () => {
				window.webContents.send('app:commandContextMenu', 'menu-item-1');
			},
		},
		{ type: 'separator' },
		{ label: 'Menu Item 2', type: 'checkbox', checked: true },
	]);
	return menu;
};
