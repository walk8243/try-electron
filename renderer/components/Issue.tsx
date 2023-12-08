import { ReactNode } from 'react'

const Issue = ({ children }: { children: ReactNode }) => (
  <section>
    <h3 style={{ display: 'none' }}>Issue</h3>
    {children}
  </section>
)

export default Issue
