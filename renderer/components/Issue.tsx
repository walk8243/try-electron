import issueStyles from '../styles/Issue.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

const Issue = ({ url }: { url?: string }) => (
  <section className={issueStyles.box}>
    <h3 className={headlineStyles['header--hidden']}>Issue</h3>
    <IssueUrlBar url={url ?? ' '} />
    <div></div>
  </section>
)

const IssueUrlBar = ({ url }: { url: string }) => (
  <div>
    <h4 className={headlineStyles['header--hidden']}>Issue URLバー</h4>
    <p>{url}</p>
  </div>
)

export default Issue
