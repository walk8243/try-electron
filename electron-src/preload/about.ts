import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('about', {
	close: () => ipcRenderer.send('about:close'),
	open: (url: string) => ipcRenderer.send('browser:open', url),
});
