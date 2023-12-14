import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction, MouseEvent } from 'react'
import type { GithubIssue } from '../interfaces/Github'

import { Card, CardActionArea, CardContent, Box, Grid, Typography } from '@mui/material'
import { Heading } from './Heading'

type Props = {
  issueUrlHandler: Dispatch<SetStateAction<string>>
}
const numberFormat = Intl.NumberFormat('ja-JP')
let issueTimer: NodeJS.Timeout;

const IssueList = ({ issueUrlHandler }: Props) => {
  const [issues, setIssues] = useState<GithubIssue[]>([])
  useEffect(() => {
    window.electron?.issues(false)
      .then((data) => setIssues(() => data))
      .catch(console.error)

    issueTimer = setInterval(() => {
      window.electron?.issues(true)
        .then((data) => setIssues(() => data))
        .catch(console.error)
    }, 5 * 60 * 1000);
  }, [])

  const handleClick = (e: MouseEvent, url: string) => {
    issueUrlHandler(() => url)
    window.electron?.issue(url)
    e.preventDefault()
  }

  return (
    <Box sx={{ height: '100%', overflowY: 'scroll' }}>
      <Heading level={3} hidden={true}>Issueリスト</Heading>
      <Box>
        <Typography>Issue</Typography>
        <Typography>{numberFormat.format(issues.length)} issues</Typography>
      </Box>
      <Grid container>
        {issues.map((issue) => (
          <Issue key={issue.node_id} issue={issue} handle={handleClick} />
        ))}
      </Grid>
    </Box>
  )
}

const Issue = ({ issue, handle }: { issue: GithubIssue, handle: (e: MouseEvent, url: string) => void }) => (
  <Card sx={{ width: '100%', m: 0.5, color: (issue.state === 'open' ? '#111' : '#444'), backgroundColor: (issue.state === 'open' ? '#eee' : '#aaa') }}>
    <CardActionArea onClick={(e) => handle(e, issue.html_url)}>
      <CardContent>
        <Typography sx={{ color: issue.state === 'open' ? '#3fb950' : '#a371f7', '::before': { content: '"●"' } }}>{Object.hasOwn(issue, 'pull_request') ? 'PR' : 'Issue'}: {issue.state}</Typography>
        <Typography>{issue.title}</Typography>
        <Typography style={{ fontSize: 'small' }}>{issue.repository.full_name}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
)

export default IssueList
