import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('setting', {
	display: () => ipcRenderer.invoke('setting:display'),
	submit: (data: SettingData) => ipcRenderer.send('setting:submit', data),
	cancel: () => ipcRenderer.send('setting:cancel'),
});

contextBridge.exposeInMainWorld('error', {
	error: (error: Error) => ipcRenderer.send('error', error),
});

export type SettingData = { baseUrl: string; token?: string };
