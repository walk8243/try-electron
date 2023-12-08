import React, { ReactNode } from 'react'
import Head from 'next/head'

import Header from './Header'
import Footer from './Footer'
import Menu from './Menu'
import IssueList from './IssueList'
import Issue from './Issue'

type Props = {
  children: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <main style={{ display: 'grid', gridTemplateColumns: '200px 300px auto' }}>
      <h2 style={{ display: 'none' }}>メイン</h2>
      <Menu />
      <IssueList />
      <Issue>{children}</Issue>
    </main>
    <Footer />
  </div>
)

export default Layout
