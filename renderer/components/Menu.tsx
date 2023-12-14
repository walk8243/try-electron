import { useContext, useEffect, useState } from 'react'
import { IssueFilterContext, IssueFilterDispatchContext, issueFilters } from '../context/IssueFilterContext'
import { GithubUserInfo } from '../interfaces/Github'

import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
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
      <div>
        <Avator {...userInfo} />
      </div>
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

const Avator = (userInfo?: GithubUserInfo) => {
  if (!userInfo) {
    return <></>
  }

  return (
    <div>
      <img src={userInfo.avatar_url} />
    </div>
  )
}

export default Menu
