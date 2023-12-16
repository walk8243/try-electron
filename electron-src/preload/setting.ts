import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('setting', {
	display: () => ipcRenderer.invoke('setting:display'),
	submit: (data: SettingData) => ipcRenderer.send('setting:submit', data),
	cancel: () => ipcRenderer.send('setting:cancel'),
});

export type SettingData = { baseUrl: string; token?: string };
