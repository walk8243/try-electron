import { useContext } from 'react';
import { ButtonBase, Typography } from '@mui/material';
import { ColorModeContext } from '../context/ColorModeContext';
import type { Issue } from '../../types/Issue';
import surface from '../styles/colors/surface';

export const UrlBar = ({ issue }: { issue?: Issue }) => {
	const colorMode = useContext(ColorModeContext);
	const handle = () => {
		if (!issue) return;
		window.electron?.open(issue?.url);
	};

	return (
		<ButtonBase
			onClick={handle}
			sx={{
				display: 'block',
				width: '100%',
				height: '100%',
				px: 2,
				border: `solid ${surface[colorMode].on} 1px`,
				borderRadius: '14px',
				backgroundColor: surface[colorMode].main,
			}}
		>
			<Typography color={surface[colorMode].on} textAlign="left">
				{issue?.url}
			</Typography>
		</ButtonBase>
	);
};
