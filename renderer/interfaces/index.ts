import { GithubUserInfo, GithubIssue } from '../../types/Github';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  interface Window {
    electron: {
      issue: (url: string) => Promise<void>
      open: (url: string) => void
      ready: () => void
      pushUser: (callback: (user: GithubUserInfo) => void) => void
      pushIssues: (callback: (issues: GithubIssue[]) => void) => void
    }
    setting: {
      display: () => Promise<SettingData>
      submit: (data: SettingData) => void
      cancel: () => void
    }
    about: {
      close: () => void
    }
  }
}

export type SettingData = { baseUrl: string, token?: string }
