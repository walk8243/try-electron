import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('update', {
	version: (tag: string) => ipcRenderer.invoke('update:version', tag),
});
