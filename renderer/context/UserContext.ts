import { createContext } from 'react'
import { GithubUserInfo } from '../../types/Github'

export const UserInfoContext = createContext<GithubUserInfo>(null)
