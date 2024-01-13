import { contextBridge, ipcRenderer } from 'electron';
import type { UserInfo } from '../../types/User';
import type { Issue, IssueSupplementMap } from '../../types/Issue';

contextBridge.exposeInMainWorld('electron', {
	issue: (issue: Issue) => ipcRenderer.invoke('github:issue', issue),
	open: (url: string) => ipcRenderer.send('browser:open', url),
	reload: () => ipcRenderer.invoke('browser:reload'),
	history: (ope: 'back' | 'forward') =>
		ipcRenderer.invoke('browser:history', ope),
	copy: (url: string) => ipcRenderer.send('browser:copy', url),
	search: (query: string, direction: 'next' | 'back') =>
		ipcRenderer.invoke('browser:search', query, direction),
	load: (
		callback: (value: {
			url: string;
			canGoBack: boolean;
			canGoForward: boolean;
		}) => void,
	) => ipcRenderer.on('browser:load', (_event, value) => callback(value)),

	ready: () => ipcRenderer.send('app:ready'),
	pushUser: (callback: (user: UserInfo) => void) =>
		ipcRenderer.on('app:pushUser', (_event, value) => callback(value)),
	pushIssues: (callback: (issues: Issue[]) => void) =>
		ipcRenderer.on('app:pushIssues', (_event, value) => callback(value)),
	pushUpdatedAt: (callback: (updatedAt: string) => void) =>
		ipcRenderer.on('app:pushUpdatedAt', (_event, value) => callback(value)),
	pushIssueSupplementMap: (callback: (map: IssueSupplementMap) => void) =>
		ipcRenderer.on('app:pushIssueSupplementMap', (_event, value) =>
			callback(value),
		),
});

contextBridge.exposeInMainWorld('error', {
	throw: (error: Error) => ipcRenderer.send('error:throw', error),
	getPath: () => ipcRenderer.invoke('error:path'),
});
