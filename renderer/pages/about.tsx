import Head from 'next/head'

const AboutPage = () => {
  const handleClose = () => {
    window.about?.close()
  }

  return (
    <div>
      <Head>
        <title>このアプリについて</title>
      </Head>
      <h1>About</h1>
      <p>This is the about page</p>
      <button onClick={handleClose}>Close</button>
    </div>
  )
}

export default AboutPage
