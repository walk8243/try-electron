import { useEffect, useState } from 'react'
import { GithubUserInfo } from '../interfaces/Github'

import headlineStyles from '../styles/Headline.module.scss'

const Menu = () => {
  const [userInfo, setUserInfo] = useState<GithubUserInfo>(null)
  useEffect(() => {
    window.electron?.userInfo()
      .then((data) => setUserInfo(() => data))
      .catch(console.error)
  }, [])

  return (
    <section>
      <h3 className={headlineStyles['header--hidden']}>メニュー</h3>
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
