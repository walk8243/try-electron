import { useEffect, useState } from 'react'
import Head from 'next/head'
import { SettingData } from '../interfaces'

import headlineStyles from '../styles/Headline.module.scss'

const SettingPage = () => {
  const [data, setData] = useState<SettingData>({ hostname: '' })
  useEffect(() => {
    window.setting?.display()
      .then((data) => {
        if (data) {
          setData(() => (data))
        }
      })
      .catch(console.error)
  }, [])

  const handleSubmit = () => {
    window.setting?.submit({ hostname: data.hostname, token: data.token })
  }
  const handleCancel = () => {
    window.setting?.cancel()
  }

  return (
    <div>
      <Head>
        <title>設定</title>
      </Head>
      <h1 className={headlineStyles['header--hidden']}>設定用のページ</h1>
  
      <section>
        <h2>設定</h2>
        <div>
          <div>
            <div>host名</div>
            <div><input value={data.hostname} onChange={e => setData(() => ({ ...data, hostname: e.target.value }))} /></div>
          </div>
          <div>
            <div>token</div>
            <div><input type='password' value={data.token} onChange={e => setData(() => ({ ...data, token: e.target.value }))} /></div>
          </div>
        </div>
      </section>
  
      <section>
        <h2>操作ボタン</h2>
        <div>
          <button onClick={handleSubmit}>保存</button>
          <button onClick={handleCancel}>キャンセル</button>
        </div>
      </section>
    </div>
  )
}

export default SettingPage
