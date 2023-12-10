import footerStyles from '../styles/Footer.module.scss'
import headlineStyles from '../styles/Headline.module.scss'

const Footer = () => (
  <footer>
    <h2 className={headlineStyles['header--hidden']}>フッタ</h2>
    <p className={footerStyles.copyrightBox}>
      <span className={footerStyles.copyright}>walk8243</span>
    </p>
  </footer>
)

export default Footer
