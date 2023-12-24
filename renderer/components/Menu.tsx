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
import surface from '../styles/colors/surface';

const Menu = () => {
	const colorMode = useContext(ColorModeContext);
	const userInfo = useContext(UserInfoContext);

	return (
		<Grid
			container
			component="section"
			display="grid"
			gridTemplateRows="60px 1fr max-content"
			rowGap={6}
			height="100%"
			p={4}
			bgcolor={surface.container[colorMode].high}
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
	<Grid container item columnGap={2}>
		<Grid item xs="auto">
			<Avatar
				alt={user.login}
				src={user.avatarUrl}
				sx={{ width: 60, height: 60 }}
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
			<Typography variant="body2">{user.login}</Typography>
		</Grid>
	</Grid>
);

const Filters = () => {
	const issueFilter = useContext(IssueFilterContext);
	const issueFilterDispatch = useContext(IssueFilterDispatchContext);

	return (
		<Grid container item width="100%">
			<Grid item width="100%">
				<Typography variant="subtitle1">Library</Typography>
				<List sx={{ px: 2 }}>
					{issueFilters.map((filter) => (
						<ListItem key={filter.type} sx={{ p: 0 }}>
							<ListItemButton
								onClick={(_e) => issueFilterDispatch(filter)}
								selected={filter.type === issueFilter.type}
								sx={{ p: '3px' }}
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
			width="100%"
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
