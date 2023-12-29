import { useContext } from 'react';
import { ButtonBase, Typography } from '@mui/material';
import { ColorModeContext } from '../context/ColorModeContext';
import surface from '../styles/colors/surface';

export const UrlBar = ({ url }: { url: string | null }) => {
	const colorMode = useContext(ColorModeContext);
	const handle = () => {
		if (!url) return;
		window.electron?.copy(url);
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
			<Typography
				color={surface[colorMode].on}
				textAlign="left"
				textOverflow="ellipsis"
				overflow="hidden"
				noWrap
			>
				{url}
			</Typography>
		</ButtonBase>
	);
};
