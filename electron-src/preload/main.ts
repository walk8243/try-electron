/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from 'electron'

// We are using the context bridge to securely expose NodeAPIs.
// Please note that many Node APIs grant access to local system resources.
// Be very cautious about which globals and APIs you expose to untrusted remote content.
contextBridge.exposeInMainWorld('electron', {
  userInfo: () => ipcRenderer.invoke('github:userInfo'),
  issues: (noticeEnable: boolean) => ipcRenderer.invoke('github:issues', noticeEnable),
  issue: (url: string) => ipcRenderer.invoke('github:issue', url),
  open: (url: string) => ipcRenderer.send('browser:open', url),
})
