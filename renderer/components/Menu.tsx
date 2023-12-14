import { useContext, useEffect, useState } from 'react'
import { IssueFilterContext, IssueFilterDispatchContext, issueFilters } from '../context/IssueFilterContext'
import { GithubUserInfo } from '../interfaces/Github'

import { Avatar, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Heading } from './Heading'

const Menu = () => {
  const [userInfo, setUserInfo] = useState<GithubUserInfo>(null)
  const issueFilter = useContext(IssueFilterContext)
  const issueFilterDispatch = useContext(IssueFilterDispatchContext)
  useEffect(() => {
    window.electron?.userInfo()
      .then((data) => setUserInfo(() => data))
      .catch(console.error)
  }, [])

  return (
    <section>
      <Heading level={3} hidden={true}>メニュー</Heading>
      {userInfo ? <User user={userInfo} /> : <></>}
      <List>
        {issueFilters.map((filter) => (
          <ListItem key={filter.type}>
            <ListItemButton onClick={(e) => issueFilterDispatch(filter)} selected={filter.type === issueFilter.type}>
              <ListItemText primary={filter.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </section>
  )
}

const User = ({ user }: { user: GithubUserInfo }) => (
  <Grid container>
    <Grid item xs='auto'>
      <Avatar alt={user.login} src={user.avatar_url} sx={{ width: 100, height: 100 }} />
    </Grid>
    <Grid item xs='auto' sx={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
      <Typography>{user.name}</Typography>
      <Typography>{user.login}</Typography>
    </Grid>
  </Grid>
)

export default Menu
