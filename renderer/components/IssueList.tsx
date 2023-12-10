import { useEffect, useState, Dispatch, SetStateAction, MouseEvent } from 'react'
import { GithubIssue } from '../interfaces/Github'

import issueListStyles from '../styles/IssueList.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

type Props = {
  issueUrlHandler: Dispatch<SetStateAction<string>>
}

const IssueList = ({ issueUrlHandler }: Props) => {
  const [issues, setIssues] = useState<GithubIssue[]>([])
  useEffect(() => {
    window.electron?.issues()
      .then((data) => setIssues(() => data))
      .catch(console.error)
  }, [])

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, url: string) => {
    issueUrlHandler(() => url)
    window.electron?.issue(url)
    e.preventDefault()
  }

  return (
    <section className={issueListStyles.box}>
      <h3 className={headlineStyles['header--hidden']}>Issueリスト</h3>
      <ul>
        {issues.map((issue) => (
          <li key={issue.node_id}>
            <a href={issue.html_url} onClick={(e) => handleClick(e, issue.html_url)}>{issue.title}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default IssueList
