import { useEffect, useState } from 'react'
import { GithubUserInfo } from '../interfaces/Github'

import { Heading } from './Heading'

const Menu = () => {
  const [userInfo, setUserInfo] = useState<GithubUserInfo>(null)
  useEffect(() => {
    window.electron?.userInfo()
      .then((data) => setUserInfo(() => data))
      .catch(console.error)
  }, [])

  return (
    <section>
      <Heading level={3} hidden={true}>メニュー</Heading>
      <div>
        <Avator {...userInfo} />
      </div>
    </section>
  )
}

const Avator = (userInfo?: GithubUserInfo) => {
  if (!userInfo) {
    return <></>
  }

  return (
    <div>
      <img src={userInfo.avatar_url} />
    </div>
  )
}

export default Menu
