import { join } from 'node:path'
import { app, ipcMain, Menu, Notification, session, shell } from 'electron'
import prepareNext from 'electron-next'
import isDev from 'electron-is-dev'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import log from 'electron-log/main'
import dayjs from 'dayjs'

import { createMenu } from './menu'
import { gainUserInfo, gainIssues, checkStoreData, githubAppSettings } from './utils/github'
import * as windowUtils from './utils/window'

log.initialize({ preload: true })
log.eventLogger.startLogging({})

const isMac = process.platform === 'darwin'

app.on('ready', async () => {
  log.verbose('App is ready')

  await prepareNext('./renderer')
  ipcMain.handle('github:userInfo', async () => {
    return await gainUserInfo()
  })
  ipcMain.handle('github:issues', async () => {
    const now = dayjs()
    const issues = await gainIssues(now.subtract(githubAppSettings.terms.value, githubAppSettings.terms.unit))
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

  const mainWindow = windowUtils.createMain()
  const webview = windowUtils.createWebview()
  mainWindow.setBrowserView(webview)

  const settingWindow = windowUtils.createSetting(mainWindow)
  const aboutWindow = windowUtils.createAbout(mainWindow)
  const menu = createMenu({ parentWindow: mainWindow, webview, settingWindow, aboutWindow })
  if (isMac) {
    Menu.setApplicationMenu(menu)
  } else {
    mainWindow.setMenu(menu)
  }
  mainWindow.show()

  ipcMain.handle('github:issue', async (_event, url: string) => {
    webview.webContents.loadURL(url)
  })
  ipcMain.on('browser:open', (_event, url: string) => {
    shell.openExternal(url)
  })

  if (!checkStoreData()) {
    settingWindow.show()
  }

  if (isDev) {
    await installExtension(REACT_DEVELOPER_TOOLS)
    await session.defaultSession.loadExtension(join(app.getPath('userData'), 'extensions', REACT_DEVELOPER_TOOLS.id))
  }
})

app.on('window-all-closed', app.quit)
