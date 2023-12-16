import type { UserInfo } from '../../types/User'
import type { Issue } from '../../types/Issue'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  interface Window {
    electron: {
      issue: (url: string) => Promise<void>
      open: (url: string) => void
      ready: () => void
      pushUser: (callback: (user: UserInfo) => void) => void
      pushIssues: (callback: (issues: Issue[]) => void) => void
    }
    setting: {
      display: () => Promise<SettingData>
      submit: (data: SettingData) => void
      cancel: () => void
    }
    about: {
      close: () => void
      open: (url: string) => void
    }
  }
}

export type SettingData = { baseUrl: string, token?: string }
