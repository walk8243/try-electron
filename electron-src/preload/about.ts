import { contextBridge, ipcRenderer } from 'electron';
import type { ErrorData } from '../../types/Error';

contextBridge.exposeInMainWorld('about', {
	version: () => ipcRenderer.invoke('app:version'),
	color: () => ipcRenderer.invoke('app:color'),
	close: () => ipcRenderer.send('about:close'),
	open: (url: string) => ipcRenderer.send('browser:open', url),
});

contextBridge.exposeInMainWorld('error', {
	throw: (error: ErrorData) => ipcRenderer.send('error:throw', error),
	getPath: () => ipcRenderer.invoke('error:path'),
});
