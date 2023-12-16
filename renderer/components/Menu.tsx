import { useContext } from 'react'
import { UserInfoContext } from '../context/UserContext'
import { IssueFilterContext, IssueFilterDispatchContext, issueFilters } from '../context/IssueFilterContext'
import type { UserInfo } from '../../types/User'

import { Avatar, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Heading } from './Heading'

const Menu = () => {
  const userInfo = useContext(UserInfoContext)
  const issueFilter = useContext(IssueFilterContext)
  const issueFilterDispatch = useContext(IssueFilterDispatchContext)

  return (
    <section>
      <Heading level={3} hidden={true}>メニュー</Heading>
      {userInfo ? <User user={userInfo} /> : <></>}
      <List>
        {issueFilters.map((filter) => (
          <ListItem key={filter.type}>
            <ListItemButton onClick={(_e) => issueFilterDispatch(filter)} selected={filter.type === issueFilter.type}>
              <ListItemIcon sx={{ minWidth: 'initial', mr: 2 }}>
                <FontAwesomeIcon icon={filter.icon} />
              </ListItemIcon>
              <ListItemText primary={filter.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </section>
  )
}

const User = ({ user }: { user: UserInfo }) => (
  <Grid container columnGap={1}>
    <Grid item xs='auto'>
      <Avatar alt={user.login} src={user.avatarUrl} sx={{ width: 80, height: 80 }} />
    </Grid>
    <Grid container item xs zeroMinWidth direction='column' justifyContent='center'>
      <Typography>{user.name}</Typography>
      <Typography>{user.login}</Typography>
    </Grid>
  </Grid>
)

export default Menu
