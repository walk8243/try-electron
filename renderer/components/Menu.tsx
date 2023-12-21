import { useEffect, useContext, useState } from 'react';
import dayjs from 'dayjs';
import { UserInfoContext } from '../context/UserContext';
import {
	IssueFilterContext,
	IssueFilterDispatchContext,
	issueFilters,
} from '../context/IssueFilterContext';
import type { UserInfo } from '../../types/User';

import {
	Avatar,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Heading } from './Heading';

const Menu = () => {
	const userInfo = useContext(UserInfoContext);

	return (
		<Grid
			container
			component={'section'}
			sx={{
				display: 'grid',
				gridTemplateRows: 'max-content 1fr max-content',
				height: '100%',
			}}
		>
			<Heading level={3} hidden={true}>
				メニュー
			</Heading>
			{userInfo ? <User user={userInfo} /> : <Grid item></Grid>}
			<Filters />
			<UpdatedAt />
		</Grid>
	);
};

const User = ({ user }: { user: UserInfo }) => (
	<Grid container item columnGap={1}>
		<Grid item xs="auto">
			<Avatar
				alt={user.login}
				src={user.avatarUrl}
				sx={{ width: 80, height: 80 }}
			/>
		</Grid>
		<Grid
			container
			item
			xs
			zeroMinWidth
			direction="column"
			justifyContent="center"
		>
			<Typography>{user.name}</Typography>
			<Typography>{user.login}</Typography>
		</Grid>
	</Grid>
);

const Filters = () => {
	const issueFilter = useContext(IssueFilterContext);
	const issueFilterDispatch = useContext(IssueFilterDispatchContext);

	return (
		<Grid item sx={{ width: '100%' }}>
			<List>
				{issueFilters.map((filter) => (
					<ListItem key={filter.type}>
						<ListItemButton
							onClick={(_e) => issueFilterDispatch(filter)}
							selected={filter.type === issueFilter.type}
						>
							<ListItemIcon sx={{ minWidth: 'initial', mr: 2 }}>
								<FontAwesomeIcon icon={filter.icon} />
							</ListItemIcon>
							<ListItemText primary={filter.title} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Grid>
	);
};

const UpdatedAt = () => {
	const [updatedAt, setUpdatedAt] = useState<string>('');
	useEffect(() => {
		window.electron.pushUpdatedAt((updatedAt) => {
			setUpdatedAt(dayjs(updatedAt).format('YYYY/MM/DD HH:mm:ss'));
		});
	}, []);

	return (
		<Grid item sx={{ width: '100%', px: 2, py: 1 }}>
			<Typography sx={{ height: '1lh', overflow: 'hidden' }}>
				{updatedAt}
			</Typography>
		</Grid>
	);
};

export default Menu;
