import issueStyles from '../styles/Issue.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

const Issue = ({ url }: { url?: string }) => (
  <section className={issueStyles.box}>
    <h3 className={headlineStyles['header--hidden']}>Issue</h3>
    <IssueUrlBar url={url ?? ' '} />
    <div></div>
  </section>
)

const IssueUrlBar = ({ url }: { url: string }) => {
  const handleClick = () => {
    window.electron?.open(url)
  }

  return (
    <div className={issueStyles.urlBar} onClick={handleClick} onKeyDown={(e) => { if (e.key === 'Enter') handleClick()}} role='note' tabIndex={0}>
      <h4 className={headlineStyles['header--hidden']}>Issue URLバー</h4>
      <p>{url}</p>
    </div>
  )
}

export default Issue
