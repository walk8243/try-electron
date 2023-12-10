// Native
import { join } from 'node:path'

// Packages
import { BrowserWindow, BrowserView, app, ipcMain, session } from 'electron'
import prepareNext from 'electron-next'
import isDev from 'electron-is-dev'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'

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
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload', 'main.js'),
    },
  })
  createMenu(mainWindow)

  mainWindow.loadURL(getLoadedUrl())

  const view = new BrowserView({})
  mainWindow.setBrowserView(view)
  view.setBounds({ x: 550, y: 24, width: 1200 - 6 - 250 - 300, height: 800 - 49 - 24 - 24 })
  view.webContents.loadURL('https://github.com/')
  ipcMain.handle('github:issue', async (_event, url: string) => {
    view.webContents.loadURL(url)
  })

  if (isDev) {
    await installExtension(REACT_DEVELOPER_TOOLS)
    console.log(app.getPath('userData'))
    await session.defaultSession.loadExtension(join(app.getPath('userData'), 'extensions', REACT_DEVELOPER_TOOLS.id))
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)
