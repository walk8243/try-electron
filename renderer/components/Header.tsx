import Link from 'next/link'

const Header = () => (
  <header>
    <h2 style={{ display: 'none' }}>ヘッダ</h2>
    <nav>
      <Link href="/">Home</Link> | <Link href="/about">About</Link> |{' '}
      <Link href="/initial-props">With Initial Props</Link>
    </nav>
  </header>
)

export default Header
