import { useContext } from 'react';
import { Grid, IconButton, Paper } from '@mui/material';
import { ColorModeContext } from '../context/ColorModeContext';
import { IssueContext } from '../context/IssueContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {} from '@fortawesome/free-regular-svg-icons';
import {
	faArrowLeft,
	faArrowRight,
	faArrowRotateRight,
	faArrowUpRightFromSquare,
	faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { Heading } from './Heading';
import { UrlBar } from './UrlBar';
import surface from '../styles/colors/surface';

const Viewer = () => {
	const colorMode = useContext(ColorModeContext);

	return (
		<Grid
			container
			component="section"
			display="grid"
			gridTemplateRows="max-content 1fr"
			height="100%"
			bgcolor={surface[colorMode].main}
		>
			<Heading level={3} hidden={true}>
				Issue
			</Heading>
			<IssueUrlBar />
			<Paper></Paper>
		</Grid>
	);
};

const IssueUrlBar = () => {
	const issue = useContext(IssueContext);
	if (!issue) return <Grid container></Grid>;

	return (
		<Grid container component="section" columnGap={2} p={2}>
			<Heading level={4} hidden={true}>
				Issue URLバー
			</Heading>
			<Grid item>
				<IconButton size="small">
					<FontAwesomeIcon icon={faArrowLeft} />
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton size="small">
					<FontAwesomeIcon icon={faArrowRight} />
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton size="small">
					<FontAwesomeIcon icon={faArrowRotateRight} />
				</IconButton>
			</Grid>
			<Grid item xs zeroMinWidth>
				<UrlBar issue={issue} />
			</Grid>
			<Grid item>
				<IconButton size="small">
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton size="small">
					<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default Viewer;
