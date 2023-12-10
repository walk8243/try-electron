import { useEffect } from 'react'
import Head from 'next/head'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Menu from '../components/Menu'
import IssueList from '../components/IssueList'
import Issue from '../components/Issue'

import styles from '../styles/index.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

const IndexPage = () => {
  useEffect(() => {}, [])

  return (
    <div className={styles.box}>
      <Head>
        <title>Amethyst</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <h2 className={headlineStyles['header--hidden']}>メイン</h2>
        <Menu />
        <IssueList />
        <Issue url='https://nogizaka46.com' />
      </main>
      <Footer />
    </div>
  )
}

export default IndexPage
