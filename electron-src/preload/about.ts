/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('about', {
	close: () => ipcRenderer.send('about:close'),
})
