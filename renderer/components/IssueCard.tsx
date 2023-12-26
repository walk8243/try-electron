import { useContext } from 'react';
import type { MouseEvent } from 'react';
import { IssueDispatchContext } from '../context/IssueContext';
import { safeUnreachable } from '../utils/typescript';
import type { Issue, IssueState, Reviewer } from '../../types/Issue';

import {
	Avatar,
	Badge,
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
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';

export const IssueCard = ({ issue }: { issue: Issue }) => {
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
					<Grid container direction="column" rowGap={1}>
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
									color="inherit"
									sx={{ overflowWrap: 'break-word' }}
								>
									{issue.title}
								</Typography>
							</Grid>
						</Grid>
						<Grid container columnGap={1}>
							<Grid item>
								<Avatar
									alt={issue.creator?.login}
									src={issue.creator?.avatarUrl}
									sx={{ width: 20, height: 20 }}
								/>
							</Grid>
							<Grid
								container
								item
								xs
								zeroMinWidth
								direction="row-reverse"
								columnGap={0.5}
							>
								{issue.reviewers.map((reviewer) => (
									<Grid item key={reviewer.login}>
										<ReviewerAvatar reviewer={reviewer} />
									</Grid>
								))}
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
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

const ReviewerAvatar = ({ reviewer }: { reviewer: Reviewer }) => {
	return (
		<Badge
			color={findIssueReviewStateIcon(reviewer.state)}
			overlap="circular"
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			variant="dot"
		>
			<Avatar
				alt={reviewer.login}
				src={reviewer.avatarUrl}
				sx={{ width: 20, height: 20 }}
			/>
		</Badge>
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
const findIssueReviewStateIcon = (state: Reviewer['state']) => {
	switch (state) {
		case 'APPROVED':
			return 'success';
		case 'CHANGES_REQUESTED':
			return 'error';
		case 'COMMENTED':
			return 'ordinarily';
	}

	safeUnreachable(state);
};
