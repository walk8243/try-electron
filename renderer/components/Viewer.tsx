import { useContext, useEffect, useState } from 'react';
import { ColorModeContext } from '../context/ColorModeContext';

import { Grid, IconButton, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
	const [url, setUrl] = useState<string | null>(null);
	const handleBack = () => {
		window.electron?.goBack();
	};
	const handleForward = () => {
		window.electron?.goForward();
	};
	const handleReload = () => {
		window.electron?.reload();
	};
	const handleOpen = () => {
		if (!url) return;
		window.electron?.open(url);
	};

	useEffect(() => {
		window.electron?.load(setUrl);
	}, []);

	return (
		<Grid container component="section" columnGap={2} p={2}>
			<Heading level={4} hidden={true}>
				Issue URLバー
			</Heading>
			<Grid item>
				<IconButton onClick={handleBack} size="small">
					<FontAwesomeIcon icon={faArrowLeft} />
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton onClick={handleForward} size="small">
					<FontAwesomeIcon icon={faArrowRight} />
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton onClick={handleReload} size="small">
					<FontAwesomeIcon icon={faArrowRotateRight} />
				</IconButton>
			</Grid>
			<Grid item xs zeroMinWidth>
				<UrlBar url={url} />
			</Grid>
			<Grid item>
				<IconButton size="small" disabled>
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton onClick={handleOpen} size="small">
					<FontAwesomeIcon icon={faArrowUpRightFromSquare} />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default Viewer;
