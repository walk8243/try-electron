// Native
import { join } from 'node:path'

// Packages
import { BrowserWindow, BrowserView, app, ipcMain, Notification, session } from 'electron'
import prepareNext from 'electron-next'
import isDev from 'electron-is-dev'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import dayjs from 'dayjs'

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
    const now = dayjs()
    const issues = await getIssues()
    const target = now.subtract(5, 'minute')
    if (issues.some((issue) => dayjs(issue.updated_at).isAfter(target))) {
      const notification = new Notification({
        title: 'Issueが更新されました',
        body: '更新されたIssue・PRがあります。Issue・PRを確認してください。',
      })
      notification.show()
    }
    return issues
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
  const webview = new BrowserView({})
  mainWindow.setBrowserView(webview)

  const menu = createMenu(mainWindow, webview)
  mainWindow.setMenu(menu)
  mainWindow.loadURL(getLoadedUrl())

  webview.setBounds({ x: 550, y: 24, width: 1200 - 6 - 250 - 300, height: 800 - 49 - 24 - 24 })
  webview.webContents.loadURL('https://github.com/')
  ipcMain.handle('github:issue', async (_event, url: string) => {
    webview.webContents.loadURL(url)
  })

  if (isDev) {
    await installExtension(REACT_DEVELOPER_TOOLS)
    await session.defaultSession.loadExtension(join(app.getPath('userData'), 'extensions', REACT_DEVELOPER_TOOLS.id))
  }
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)
