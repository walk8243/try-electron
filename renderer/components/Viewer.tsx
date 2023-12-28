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
	const [canGo, setCanGo] = useState<{ back: boolean; forward: boolean }>({
		back: false,
		forward: false,
	});
	const handleHistory = async (direction: 'back' | 'forward') => {
		const result = (await window.electron?.history(direction)) ?? {
			canGoBack: false,
			canGoForward: false,
		};
		setCanGo({ back: result.canGoBack, forward: result.canGoForward });
	};
	const handleReload = () => {
		window.electron?.reload();
	};
	const handleOpen = () => {
		if (!url) return;
		window.electron?.open(url);
	};

	useEffect(() => {
		window.electron?.load(({ url, canGoBack, canGoForward }) => {
			setUrl(url);
			setCanGo({ back: canGoBack, forward: canGoForward });
		});
	}, []);

	return (
		<Grid container component="section" columnGap={2} p={2}>
			<Heading level={4} hidden={true}>
				Issue URLバー
			</Heading>
			<Grid item>
				<IconButton
					onClick={() => handleHistory('back')}
					size="small"
					disabled={!canGo.back}
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</IconButton>
			</Grid>
			<Grid item>
				<IconButton
					onClick={() => handleHistory('forward')}
					size="small"
					disabled={!canGo.forward}
				>
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
