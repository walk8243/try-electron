import { createElement, useEffect, useState } from 'react'
import type { ReactNode, Dispatch, SetStateAction, MouseEvent } from 'react'
import type { GithubIssue } from '../interfaces/Github'

import issueListStyles from '../styles/IssueList.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

type Props = {
  issueUrlHandler: Dispatch<SetStateAction<string>>
}
const numberFormat = Intl.NumberFormat('ja-JP')
let issueTimer: NodeJS.Timeout;

const IssueList = ({ issueUrlHandler }: Props) => {
  const [issues, setIssues] = useState<GithubIssue[]>([])
  useEffect(() => {
    window.electron?.issues(false)
      .then((data) => setIssues(() => data))
      .catch(console.error)

    issueTimer = setInterval(() => {
      window.electron?.issues(true)
        .then((data) => setIssues(() => data))
        .catch(console.error)
    }, 5 * 60 * 1000);
  }, [])

  const handleClick = (e: MouseEvent, url: string) => {
    issueUrlHandler(() => url)
    window.electron?.issue(url)
    e.preventDefault()
  }

  return (
    <section className={issueListStyles.box}>
      <h3 className={headlineStyles['header--hidden']}>Issueリスト</h3>
      <div>
        <p>Issues</p>
        <p>{numberFormat.format(issues.length)} issues</p>
      </div>
      <ListBox>
        {issues.map((issue) => (
          <Issue key={issue.node_id} issue={issue} handle={handleClick} />
        ))}
      </ListBox>
    </section>
  )
}

const ListBox = ({ children }: { children: ReactNode }) => (
  createElement('md-list', {}, children)
)

const Issue = ({ issue, handle }: { issue: GithubIssue, handle: (e: MouseEvent, url: string) => void }) => (
  createElement('md-list-item', {
    style: { color: issue.state === 'open' ? '#111' : '#444', backgroundColor: issue.state === 'open' ? '#eee' : '#aaa', cursor: 'pointer' },
    onClick: (e) => handle(e, issue.html_url)
  }, (
    <p className={issueListStyles['issue_title']} style={{ color: issue.state === 'open' ? '#3fb950' : '#a371f7' }}>
      {Object.hasOwn(issue, 'pull_request') ? 'PR' : 'Issue'}: {issue.state}
    </p>
  ), (
    <p>{issue.title}</p>
  ), (
    <p style={{ fontSize: 'small' }}>{issue.repository.full_name}</p>
  ))
)

export default IssueList
