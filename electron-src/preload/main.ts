/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from 'electron'
import { GithubUserInfo, GithubIssue } from '../../types/Github'

contextBridge.exposeInMainWorld('electron', {
  issue: (url: string) => ipcRenderer.invoke('github:issue', url),
  open: (url: string) => ipcRenderer.send('browser:open', url),
  
  ready: () => ipcRenderer.send('app:ready'),
  pushUser: (callback: (user: GithubUserInfo) => void) => ipcRenderer.on('app:pushUser', (_event, value) => callback(value)),
  pushIssues: (callback: (issues: GithubIssue[]) => void) => ipcRenderer.on('app:pushIssues', (_event, value) => callback(value)),
})
