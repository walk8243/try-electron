import { contextBridge, ipcRenderer } from 'electron';
import type { UpdateStatus } from '../../types/Update';
import type { ErrorData } from '../../types/Error';

contextBridge.exposeInMainWorld('update', {
	version: (status: UpdateStatus) =>
		ipcRenderer.invoke('update:version', status),
	download: () => ipcRenderer.send('update:download'),
	copy: (command: string) => ipcRenderer.send('update:copy', command),
	openRelease: () => ipcRenderer.send('update:openRelease'),
	color: () => ipcRenderer.invoke('app:color'),
	openLink: (url: string) => ipcRenderer.send('browser:open', url),
	close: () => ipcRenderer.send('update:close'),
});

contextBridge.exposeInMainWorld('error', {
	throw: (error: ErrorData) => ipcRenderer.send('error:throw', error),
	getPath: () => ipcRenderer.invoke('error:path'),
});
