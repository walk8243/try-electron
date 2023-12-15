import { createContext } from 'react'
import { GithubUserInfo } from '../interfaces/Github'

export const UserInfoContext = createContext<GithubUserInfo>(null)
