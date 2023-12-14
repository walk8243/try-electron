import { Heading } from './Heading'
import issueStyles from '../styles/Issue.module.scss'

const Issue = ({ url }: { url?: string }) => (
  <section className={issueStyles.box}>
    <Heading level={3} hidden={true}>Issue</Heading>
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
      <Heading level={4} hidden={true}>Issue URLバー</Heading>
      <p>{url}</p>
    </div>
  )
}

export default Issue
