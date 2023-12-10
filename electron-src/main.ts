// Native
import { join } from 'node:path'

// Packages
import { BrowserWindow, app, ipcMain } from 'electron'
import prepareNext from 'electron-next'

import { createMenu } from './menu'
import { getUserInfo, getIssues } from './utils/github'
import { getLoadedUrl } from './utils/render'

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')
  ipcMain.handle('github:userInfo', async () => {
    return await getUserInfo()
  })
  ipcMain.handle('github:issues', async () => {
    return await getIssues()
  })

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
