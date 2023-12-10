import { GithubUserInfo, GithubIssue } from './Github';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  interface Window {
    electron: {
      userInfo: () => Promise<GithubUserInfo>
      issues: () => Promise<GithubIssue[]>
    }
    setting: {
      display: () => Promise<SettingData>
      submit: (data: SettingData) => void
      cancel: () => void
    }
  }
}

export type SettingData = { hostname: string, token?: string }
