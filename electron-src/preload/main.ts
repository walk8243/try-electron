import { contextBridge, ipcRenderer } from 'electron';
import type { UserInfo } from '../../types/User';
import type { Issue } from '../../types/Issue';

contextBridge.exposeInMainWorld('electron', {
	issue: (url: string) => ipcRenderer.invoke('github:issue', url),
	open: (url: string) => ipcRenderer.send('browser:open', url),

	ready: () => ipcRenderer.send('app:ready'),
	pushUser: (callback: (user: UserInfo) => void) =>
		ipcRenderer.on('app:pushUser', (_event, value) => callback(value)),
	pushIssues: (callback: (issues: Issue[]) => void) =>
		ipcRenderer.on('app:pushIssues', (_event, value) => callback(value)),
});
