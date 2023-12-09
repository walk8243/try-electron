import { GithubUserInfo } from './Github';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  interface Window {
    electron: {
      sayHello: () => void
      receiveHello: (handler: (event, args) => void) => void
      stopReceivingHello: (handler: (event, args) => void) => void
      userInfo: () => Promise<GithubUserInfo>
    }
  }
}
