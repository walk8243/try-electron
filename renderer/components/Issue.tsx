import issueStyles from '../styles/Issue.module.scss'

const Issue = ({ url }: { url?: string }) => (
  <section className={issueStyles.box}>
    <h3 style={{ display: 'none' }}>Issue</h3>
    <p>{url ?? ' '}</p>
  </section>
)

export default Issue
