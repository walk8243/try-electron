import { useReducer, useState, Reducer } from 'react'
import Head from 'next/head'

import { IssueFilterContext, IssueFilterDispatchContext, issueFilterAll, IssueFilter } from '../context/IssueFilterContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import IssueList from '../components/IssueList'
import Issue from '../components/Issue'

import styles from '../styles/index.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

const IndexPage = () => {
  const [ issueUrl, setIssueUrl ] = useState('')
  const [ issueFilter, dispatch ] = useReducer<Reducer<IssueFilter, IssueFilter>>((_prevFilter, currentfilter) => currentfilter, issueFilterAll)

  return (
    <IssueFilterContext.Provider value={issueFilter}>
      <IssueFilterDispatchContext.Provider value={dispatch}>
        <div className={styles.box}>
          <Head>
            <title>Amethyst</title>
          </Head>
          <Header />
          <main className={styles.main}>
            <h2 className={headlineStyles['header--hidden']}>メイン</h2>
            <Menu />
            <IssueList issueUrlHandler={setIssueUrl} />
            <Issue url={issueUrl} />
          </main>
          <Footer />
        </div>
      </IssueFilterDispatchContext.Provider>
    </IssueFilterContext.Provider>
  )
}

export default IndexPage
