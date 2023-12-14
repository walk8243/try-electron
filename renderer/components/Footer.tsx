import { Heading } from './Heading'
import footerStyles from '../styles/Footer.module.scss'

const Footer = () => (
  <footer>
    <Heading level={2} hidden={true}>フッタ</Heading>
    <p className={footerStyles.copyrightBox}>
      <span className={footerStyles.copyright}>walk8243</span>
    </p>
  </footer>
)

export default Footer
