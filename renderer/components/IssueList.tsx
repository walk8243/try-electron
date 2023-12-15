import { useContext, useEffect, useState } from 'react'
import type { Dispatch, SetStateAction, MouseEvent } from 'react'
import { UserInfoContext } from '../context/UserContext'
import { IssueFilterContext } from '../context/IssueFilterContext'
import type { GithubIssue } from '../../types/Github'

import { Card, CardActionArea, CardContent, Box, Grid, Typography } from '@mui/material'
import { Heading } from './Heading'

type Props = {
  issueUrlHandler: Dispatch<SetStateAction<string>>
}
const numberFormat = Intl.NumberFormat('ja-JP')

const IssueList = ({ issueUrlHandler }: Props) => {
  const userInfo = useContext(UserInfoContext)
  const [issues, setIssues] = useState<GithubIssue[]>([])
  const issueFilter = useContext(IssueFilterContext)
  useEffect(() => {
    window.electron?.pushIssues((issues) => setIssues(() => issues))
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
        {issues.filter((issue) => issueFilter.filter(issue, { user: userInfo })).map((issue) => (
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
        <Typography variant='body1' sx={{ overflowWrap: 'break-word' }}>{issue.title}</Typography>
        <Typography variant='body2' sx={{ textOverflow: 'ellipsis' }}>{issue.repository.full_name}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
)

export default IssueList
