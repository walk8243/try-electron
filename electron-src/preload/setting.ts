/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from 'electron'

// We are using the context bridge to securely expose NodeAPIs.
// Please note that many Node APIs grant access to local system resources.
// Be very cautious about which globals and APIs you expose to untrusted remote content.
contextBridge.exposeInMainWorld('setting', {
	display: () => ipcRenderer.invoke('setting:display'),
	submit: (data: SettingData) => ipcRenderer.send('submit', data),
	cancel: () => ipcRenderer.send('cancel'),
})

export type SettingData = { baseUrl: string, token?: string }
