import { useContext, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction, MouseEvent } from 'react';
import { UserInfoContext } from '../context/UserContext';
import { IssueFilterContext } from '../context/IssueFilterContext';
import { safeUnreachable } from '../utils/typescript';
import type { Issue, IssueState } from '../../types/Issue';

import {
	Card,
	CardActionArea,
	CardContent,
	Box,
	Grid,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	IconDefinition,
	faCodePullRequest,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { Heading } from './Heading';

type Props = {
	issueUrlHandler: Dispatch<SetStateAction<string>>;
};
const numberFormat = Intl.NumberFormat('ja-JP');

const IssueList = ({ issueUrlHandler }: Props) => {
	const userInfo = useContext(UserInfoContext);
	const [issues, setIssues] = useState<Issue[]>([]);
	const issueFilter = useContext(IssueFilterContext);
	useEffect(() => {
		window.electron?.pushIssues((issues) => setIssues(() => issues));
	}, []);

	const handleClick = (e: MouseEvent, url: string) => {
		issueUrlHandler(() => url);
		window.electron?.issue(url);
		e.preventDefault();
	};

	return (
		<Box sx={{ height: '100%', overflowY: 'scroll' }}>
			<Heading level={3} hidden={true}>
				Issueリスト
			</Heading>
			<Box>
				<Heading level={4}>Issue</Heading>
				<Typography variant="subtitle1">
					{numberFormat.format(issues.length)} issues
				</Typography>
			</Box>
			<Grid container>
				{issues
					.filter((issue) => issueFilter.filter(issue, { user: userInfo }))
					.map((issue) => (
						<IssueCard key={issue.key} issue={issue} handle={handleClick} />
					))}
			</Grid>
		</Box>
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
