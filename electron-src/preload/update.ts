import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('update', {
	version: (tag: string) => ipcRenderer.invoke('update:version', tag),
	download: () => ipcRenderer.send('update:download'),
	openRelease: () => ipcRenderer.send('update:openRelease'),
	openLink: (url: string) => ipcRenderer.send('browser:open', url),
	close: () => ipcRenderer.send('update:close'),
});
