// Native
import { join } from 'node:path'

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron'
import prepareNext from 'electron-next'

import { createMenu } from './menu'
import { store } from './utils/store'
import { getUserInfo } from './utils/github'
import { getLoadedUrl } from './utils/render'

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')
  if (store.has('githubToken')) {
    ipcMain.handle('github:userInfo', async () => {
      return await getUserInfo('https://api.github.com/user')
    })
  }

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload', 'main.js'),
    },
  })
  createMenu(mainWindow)

  mainWindow.loadURL(getLoadedUrl())
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message)
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500)
})
