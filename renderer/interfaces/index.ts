import { GithubUserInfo, GithubIssue } from './Github';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  interface Window {
    electron: {
      userInfo: () => Promise<GithubUserInfo>
      issues: (noticeEnable: boolean) => Promise<GithubIssue[]>
      issue: (url: string) => Promise<void>
      open: (url: string) => void
    }
    setting: {
      display: () => Promise<SettingData>
      submit: (data: SettingData) => void
      cancel: () => void
    }
  }
}

export type SettingData = { baseUrl: string, token?: string }
