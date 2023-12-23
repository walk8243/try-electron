import { useContext } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Heading } from './Heading';
import { ColorModeContext } from '../context/ColorModeContext';
import surface from '../styles/colors/surface';

const Issue = ({ url }: { url?: string }) => {
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
			<IssueUrlBar url={url ?? ' '} />
			<Paper></Paper>
		</Grid>
	);
};

const IssueUrlBar = ({ url }: { url: string }) => {
	const handleClick = () => {
		window.electron?.open(url);
	};

	return (
		<Box
			component="section"
			onClick={handleClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter') handleClick();
			}}
			role="note"
			tabIndex={0}
			px={1}
			sx={{ cursor: 'pointer' }}
		>
			<Heading level={4} hidden={true}>
				Issue URLバー
			</Heading>
			<Typography height="1lh">{url}</Typography>
		</Box>
	);
};

export default Issue;
