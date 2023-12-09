import { useEffect, useState } from 'react'
import { GithubIssue } from '../interfaces/Github'
import headlineStyles from '../styles/Headline.module.scss'

const IssueList = () => {
  const [issues, setissues] = useState<GithubIssue[]>([])
  useEffect(() => {
    window.electron?.issues()
      .then((data) => setissues(() => data))
      .catch(console.error)
  }, [])

  return (
    <section>
      <h3 className={headlineStyles['header--hidden']}>Issueリスト</h3>
      <ul>
        {issues.map((issue) => (
          <li key={issue.node_id}>
            <a href={issue.html_url} target="_blank" rel="noreferrer">{issue.title}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default IssueList
