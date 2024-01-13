import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('about', {
	version: () => ipcRenderer.invoke('app:version'),
	close: () => ipcRenderer.send('about:close'),
	open: (url: string) => ipcRenderer.send('browser:open', url),
});

contextBridge.exposeInMainWorld('error', {
	throw: (error: Error) => ipcRenderer.send('error:throw', error),
	getPath: () => ipcRenderer.invoke('error:path'),
});
