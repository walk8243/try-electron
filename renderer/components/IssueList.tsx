import { useContext } from 'react';
import { ColorModeContext } from '../context/ColorModeContext';
import { IssueListContext } from '../context/IssueContext';
import { IssueFilterContext } from '../context/IssueFilterContext';
import { IssueSupplementMapContext } from '../context/IssueSupplementMapContext';
import { UserInfoContext } from '../context/UserContext';
import type { Issue } from '../../types/Issue';

import { Grid, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Heading } from './Heading';
import { IssueCard } from './IssueCard';
import surface from '../styles/colors/surface';

const numberFormat = Intl.NumberFormat('ja-JP');

const IssueList = () => {
	const issues = useContext(IssueListContext);

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
			<Typography variant="subtitle2">{subtitle}</Typography>
		</Grid>
	);
};

const IssueCards = ({ issues }: { issues: Issue[] | null }) => {
	const colorMode = useContext(ColorModeContext);
	const userInfo = useContext(UserInfoContext);
	const issueFilter = useContext(IssueFilterContext);
	const issueSupplementMap = useContext(IssueSupplementMapContext);

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
			alignContent="flex-start"
			alignItems="flex-start"
			rowGap={1}
			p={1}
			bgcolor={surface.container[colorMode].main}
			sx={{ overflowY: 'auto' }}
		>
			{issues
				.filter((issue) => issueFilter.filter(issue, { user: userInfo }))
				.map((issue) => (
					<Grid item key={issue.key} xs={12}>
						<IssueCard
							issue={issue}
							supplement={issueSupplementMap[issue.key]}
						/>
					</Grid>
				))}
		</Grid>
	);
};

export default IssueList;
