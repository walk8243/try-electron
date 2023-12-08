import React, { ReactNode } from 'react'
import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'
import Menu from './Menu'
import IssueList from './IssueList'
import Issue from './Issue'

import layoutStyles from '../styles/Layout.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div className={layoutStyles.box}>
    <Head>
      <title>{title}</title>
    </Head>
    <Header />
    <main className={layoutStyles.main}>
      <h2 className={headlineStyles['header--hidden']}>メイン</h2>
      <Menu />
      <IssueList />
      <Issue>{children}</Issue>
    </main>
    <Footer />
  </div>
)

export default Layout
