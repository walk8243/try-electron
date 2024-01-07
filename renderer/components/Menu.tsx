import { useEffect, useContext, useState } from 'react';
import dayjs from 'dayjs';
import {
	ColorModeContext,
	ColorModeDispatchContext,
} from '../context/ColorModeContext';
import { IssueListContext } from '../context/IssueContext';
import {
	IssueFilter,
	IssueFilterContext,
	IssueFilterDispatchContext,
	issueFilters,
} from '../context/IssueFilterContext';
import { IssueSupplementMapContext } from '../context/IssueSupplementMapContext';
import { UserInfoContext } from '../context/UserContext';
import type { UserInfo } from '../../types/User';

import {
	Avatar,
	Box,
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
import tertiary from '../styles/colors/tertiary';

const Menu = () => {
	const colorMode = useContext(ColorModeContext);
	const userInfo = useContext(UserInfoContext);

	return (
		<Box
			component="section"
			height="100%"
			p={4}
			bgcolor={surface.container[colorMode].high}
		>
			<Heading level={3} hidden>
				メニュー
			</Heading>
			<Grid
				container
				display="grid"
				gridTemplateRows="60px 1fr max-content"
				rowGap={6}
				height="100%"
			>
				{userInfo ? <User user={userInfo} /> : <Grid item></Grid>}
				<Filters user={userInfo} />
				<UpdatedAt />
			</Grid>
		</Box>
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

const Filters = ({ user }: { user: UserInfo | null }) => {
	const issueFilter = useContext(IssueFilterContext);
	const issueFilterDispatch = useContext(IssueFilterDispatchContext);

	return (
		<Grid container item width="100%">
			<Grid item width="100%">
				<Typography variant="subtitle1" mb={1}>
					Library
				</Typography>
				<List sx={{ px: 2, py: 0 }}>
					{issueFilters.map((filter) => (
						<ListItem key={filter.type} sx={{ my: 1, p: 0 }}>
							<ListItemButton
								onClick={(_e) => issueFilterDispatch(filter)}
								selected={filter.type === issueFilter.type}
								sx={{ p: '3px', borderRadius: 1 }}
							>
								<ListItemIcon sx={{ minWidth: 'initial', mr: 2 }}>
									<FontAwesomeIcon icon={filter.icon} />
								</ListItemIcon>
								<ListItemText primary={filter.title} />
								<UnreadMarker user={user} filter={filter} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Grid>
		</Grid>
	);
};

const UnreadMarker = ({
	user,
	filter,
}: {
	user: UserInfo | null;
	filter: IssueFilter;
}) => {
	const colorMode = useContext(ColorModeContext);
	const issues = useContext(IssueListContext);
	const issueSupplementMap = useContext(IssueSupplementMapContext);
	if (!user || !issues) return <></>;

	const unreadCount = filter.count(issues, issueSupplementMap, { user });
	if (unreadCount === 0) return <></>;

	return (
		<ListItemText
			primary={unreadCount}
			sx={{
				color: tertiary[colorMode].on,
				bgcolor: tertiary[colorMode].main,
				px: 1,
				borderRadius: 3,
				minWidth: '1lh',
				flex: 'initial',
				textAlign: 'center',
			}}
		/>
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
