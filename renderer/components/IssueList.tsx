import { useContext, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { ColorModeContext } from '../context/ColorModeContext';
import { IssueDispatchContext } from '../context/IssueContext';
import { IssueFilterContext } from '../context/IssueFilterContext';
import { UserInfoContext } from '../context/UserContext';
import { safeUnreachable } from '../utils/typescript';
import type { Issue, IssueState } from '../../types/Issue';

import {
	Card,
	CardActionArea,
	CardContent,
	Grid,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	IconDefinition,
	faCodePullRequest,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { Heading } from './Heading';
import surface from '../styles/colors/surface';

const numberFormat = Intl.NumberFormat('ja-JP');

const IssueList = () => {
	const [issues, setIssues] = useState<Issue[] | null>(null);
	useEffect(() => {
		window.electron?.pushIssues((issues) => setIssues(() => issues));
	}, []);

	return (
		<Grid
			container
			display="grid"
			gridTemplateRows="max-content 1fr"
			rowGap={1}
			sx={{ height: '100%' }}
		>
			<Heading level={3} hidden={true}>
				Issueリスト
			</Heading>
			<Header issues={issues} />
			<IssueCards issues={issues} />
		</Grid>
	);
};

const Header = ({ issues }: { issues: Issue[] | null }) => {
	const subtitle = issues
		? `${numberFormat.format(issues.length)} issues`
		: 'Loading...';
	const colorMode = useContext(ColorModeContext);

	return (
		<Grid item p={3} bgcolor={surface.container[colorMode].high} boxShadow={4}>
			<Heading level={4}>Issue</Heading>
			<Typography variant="subtitle1">{subtitle}</Typography>
		</Grid>
	);
};

const IssueCards = ({ issues }: { issues: Issue[] | null }) => {
	const colorMode = useContext(ColorModeContext);
	const userInfo = useContext(UserInfoContext);
	const issueFilter = useContext(IssueFilterContext);

	if (!issues) {
		return (
			<Grid
				container
				item
				alignItems="center"
				justifyContent="center"
				bgcolor={surface.container[colorMode].main}
			>
				<Grid item>
					<FontAwesomeIcon icon={faSpinner} size="xl" spin={true} />
				</Grid>
			</Grid>
		);
	}

	return (
		<Grid
			container
			p={1}
			bgcolor={surface.container[colorMode].main}
			sx={{ overflowY: 'auto' }}
		>
			{issues
				.filter((issue) => issueFilter.filter(issue, { user: userInfo }))
				.map((issue) => (
					<IssueCard key={issue.key} issue={issue} />
				))}
		</Grid>
	);
};

const IssueCard = ({ issue }: { issue: Issue }) => {
	const dispatch = useContext(IssueDispatchContext);
	const handleClick = (e: MouseEvent) => {
		dispatch(issue);
		window.electron?.issue(issue.url);
		e.preventDefault();
	};

	return (
		<Card sx={{ width: '100%', m: 0.5 }}>
			<CardActionArea onClick={handleClick}>
				<CardContent>
					<Grid container columnGap={1}>
						<Grid item pt="2px">
							<FontAwesomeIcon
								icon={findIssueIcon(issue.state)}
								color={findIssueStateColor(issue.state)}
							/>
						</Grid>
						<Grid item xs zeroMinWidth>
							<Typography
								variant="subtitle1"
								sx={{ overflowWrap: 'break-word' }}
							>
								{issue.title}
							</Typography>
						</Grid>
					</Grid>
					<Grid container columnGap={1}>
						<Grid container item xs zeroMinWidth>
							<Typography variant="body2">{issue.repositoryName}</Typography>
							<Typography
								variant="body2"
								sx={{ ml: 1, '::before': { content: '"#"' } }}
							>
								{issue.number}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

const findIssueIcon = (state: IssueState): IconDefinition => {
	switch (state.type) {
		case 'issue':
			return faCircleDot;
		case 'pull-request':
			return faCodePullRequest;
	}

	safeUnreachable(state);
};
const findIssueStateColor = (state: IssueState): string => {
	switch (state.state) {
		case 'open':
			return 'green';
		case 'closed':
			return 'red';
		case 'merged':
			return 'purple';
		case 'draft':
			return 'gray';
	}

	safeUnreachable(state);
};

export default IssueList;
