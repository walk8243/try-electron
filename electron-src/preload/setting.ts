import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('setting', {
	display: () => ipcRenderer.invoke('setting:display'),
	submit: (data: SettingData) => ipcRenderer.send('setting:submit', data),
	cancel: () => ipcRenderer.send('setting:cancel'),
});

contextBridge.exposeInMainWorld('error', {
	throw: (error: Error) => ipcRenderer.send('error:throw', error),
	getPath: () => ipcRenderer.invoke('error:path'),
});

export type SettingData = { baseUrl: string; token?: string };
