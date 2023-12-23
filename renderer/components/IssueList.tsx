import { useContext, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction, MouseEvent } from 'react';
import { ColorModeContext } from '../context/ColorModeContext';
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

type Props = {
	issueUrlHandler: Dispatch<SetStateAction<string>>;
};
const numberFormat = Intl.NumberFormat('ja-JP');

const IssueList = ({ issueUrlHandler }: Props) => {
	const [issues, setIssues] = useState<Issue[] | null>(null);
	useEffect(() => {
		window.electron?.pushIssues((issues) => setIssues(() => issues));
	}, []);

	const handleClick = (e: MouseEvent, url: string) => {
		issueUrlHandler(() => url);
		window.electron?.issue(url);
		e.preventDefault();
	};

	return (
		<Grid
			container
			display="grid"
			gridTemplateRows="max-content 1fr"
			sx={{ height: '100%' }}
		>
			<Heading level={3} hidden={true}>
				Issueリスト
			</Heading>
			<Header issues={issues} />
			<IssueCards issues={issues} handle={handleClick} />
		</Grid>
	);
};

const Header = ({ issues }: { issues: Issue[] | null }) => {
	const subtitle = issues
		? `${numberFormat.format(issues.length)} issues`
		: 'Loading...';
	const colorMode = useContext(ColorModeContext);

	return (
		<Grid item bgcolor={surface.container[colorMode].high}>
			<Heading level={4}>Issue</Heading>
			<Typography variant="subtitle1">{subtitle}</Typography>
		</Grid>
	);
};

const IssueCards = ({
	issues,
	handle,
}: {
	issues: Issue[] | null;
	handle: (e: MouseEvent, url: string) => void;
}) => {
	const userInfo = useContext(UserInfoContext);
	const issueFilter = useContext(IssueFilterContext);

	if (!issues) {
		return (
			<Grid container item alignItems="center" justifyContent="center">
				<Grid item>
					<FontAwesomeIcon icon={faSpinner} size="xl" spin={true} />
				</Grid>
			</Grid>
		);
	}

	return (
		<Grid container sx={{ overflowY: 'scroll' }}>
			{issues
				.filter((issue) => issueFilter.filter(issue, { user: userInfo }))
				.map((issue) => (
					<IssueCard key={issue.key} issue={issue} handle={handle} />
				))}
		</Grid>
	);
};

const IssueCard = ({
	issue,
	handle,
}: {
	issue: Issue;
	handle: (e: MouseEvent, url: string) => void;
}) => (
	<Card sx={{ width: '100%', m: 0.5 }}>
		<CardActionArea onClick={(e) => handle(e, issue.url)}>
			<CardContent>
				<Grid container columnGap={1}>
					<Grid item>
						<FontAwesomeIcon
							icon={findIssueIcon(issue.state)}
							color={findIssueStateColor(issue.state)}
						/>
					</Grid>
					<Grid item xs zeroMinWidth>
						<Typography variant="body1" sx={{ overflowWrap: 'break-word' }}>
							{issue.title}
						</Typography>
					</Grid>
				</Grid>
				<Typography variant="body2" sx={{ textOverflow: 'ellipsis' }}>
					{issue.repositoryName}
				</Typography>
			</CardContent>
		</CardActionArea>
	</Card>
);

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
