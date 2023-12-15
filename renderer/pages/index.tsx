import { useEffect, useReducer, useState, Reducer, ReactNode } from 'react'
import Head from 'next/head'
import { GithubUserInfo } from '../../types/Github'

import { UserInfoContext } from '../context/UserContext'
import { IssueFilterContext, IssueFilterDispatchContext, issueFilterAll, IssueFilter } from '../context/IssueFilterContext'
import { Heading } from '../components/Heading'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import IssueList from '../components/IssueList'
import Issue from '../components/Issue'

import styles from '../styles/index.module.scss'

const IndexPage = () => {
  useEffect(() => {
    window.electron?.ready()
  }, [])

  return (
    <>
      <Head>
        <title>Amethyst</title>
      </Head>
      <IssueFilterContextProvider>
        <UserInfoContextProvider>
          <MainComponent />
        </UserInfoContextProvider>
      </IssueFilterContextProvider>
    </>
  )
}

const MainComponent = () => {
  const [issueUrl, setIssueUrl] = useState('')

  return (
    <div className={styles.box}>
      <Header />
      <main className={styles.main}>
        <Heading level={2} hidden={true}>メイン</Heading>
        <Menu />
        <IssueList issueUrlHandler={setIssueUrl} />
        <Issue url={issueUrl} />
      </main>
      <Footer />
    </div>
  )
}

const UserInfoContextProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<GithubUserInfo>(null)
  useEffect(() => {
    window.electron?.pushUser((user) => setUserInfo(() => user))
  }, [])

  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  )
}

const IssueFilterContextProvider = ({ children }: { children: ReactNode }) => {
  const [issueFilter, dispatch] = useReducer<Reducer<IssueFilter, IssueFilter>>((_prevFilter, currentfilter) => currentfilter, issueFilterAll)

  return (
    <IssueFilterContext.Provider value={issueFilter}>
      <IssueFilterDispatchContext.Provider value={dispatch}>
        {children}
      </IssueFilterDispatchContext.Provider>
    </IssueFilterContext.Provider>
  )
}

export default IndexPage
