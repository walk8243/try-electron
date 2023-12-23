import { useEffect, useContext, useState } from 'react';
import dayjs from 'dayjs';
import {
	ColorModeContext,
	ColorModeDispatchContext,
} from '../context/ColorModeContext';
import {
	IssueFilterContext,
	IssueFilterDispatchContext,
	issueFilters,
} from '../context/IssueFilterContext';
import { UserInfoContext } from '../context/UserContext';
import type { UserInfo } from '../../types/User';

import {
	Avatar,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { Heading } from './Heading';

const Menu = () => {
	const userInfo = useContext(UserInfoContext);

	return (
		<Grid
			container
			component="section"
			sx={{
				display: 'grid',
				gridTemplateRows: '80px 1fr max-content',
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
	const colorMode = useContext(ColorModeContext);
	const colorModeDispatch = useContext(ColorModeDispatchContext);
	useEffect(() => {
		window.electron.pushUpdatedAt((updatedAt) => {
			if (!updatedAt) return '';
			setUpdatedAt(dayjs(updatedAt).format('YYYY/MM/DD HH:mm:ss'));
		});
	}, []);

	return (
		<Grid
			container
			item
			justifyContent="space-between"
			alignItems="center"
			sx={{ width: '100%', px: 2, py: 1 }}
		>
			<Grid item>
				<Typography
					sx={{ height: '1lh', overflow: 'hidden', verticalAlign: 'bottom' }}
				>
					{updatedAt}
				</Typography>
			</Grid>
			<Grid item>
				<IconButton
					aria-label="toggle color mode"
					size="small"
					onClick={() => {
						colorModeDispatch(colorMode === 'light' ? 'dark' : 'light');
					}}
				>
					<FontAwesomeIcon icon={colorMode === 'light' ? faSun : faMoon} />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default Menu;
