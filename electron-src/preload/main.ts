import { contextBridge, ipcRenderer } from 'electron';
import type { UserInfo } from '../../types/User';
import type { Issue } from '../../types/Issue';

contextBridge.exposeInMainWorld('electron', {
	issue: (url: string) => ipcRenderer.invoke('github:issue', url),
	open: (url: string) => ipcRenderer.send('browser:open', url),
	goBack: () => ipcRenderer.invoke('browser:back'),
	goForward: () => ipcRenderer.invoke('browser:forward'),
	reload: () => ipcRenderer.invoke('browser:reload'),
	copy: (url: string) => ipcRenderer.send('browser:copy', url),
	load: (callback: (url: string) => void) =>
		ipcRenderer.on('browser:load', (_event, value) => callback(value)),

	ready: () => ipcRenderer.send('app:ready'),
	pushUser: (callback: (user: UserInfo) => void) =>
		ipcRenderer.on('app:pushUser', (_event, value) => callback(value)),
	pushIssues: (callback: (issues: Issue[]) => void) =>
		ipcRenderer.on('app:pushIssues', (_event, value) => callback(value)),
	pushUpdatedAt: (callback: (updatedAt: string) => void) =>
		ipcRenderer.on('app:pushUpdatedAt', (_event, value) => callback(value)),
});
