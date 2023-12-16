import { createContext } from 'react'
import type { UserInfo } from '../../types/User'

export const UserInfoContext = createContext<UserInfo | null>(null)
