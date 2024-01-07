import { ReactNode } from 'react';
import { SxProps, Theme, Typography } from '@mui/material';

export const Heading = ({
	children,
	level = 1,
	hidden = false,
	sx = {},
}: {
	children: ReactNode;
	level: 1 | 2 | 3 | 4 | 5 | 6;
	hidden?: boolean;
	sx?: SxProps<Theme>;
}) => (
	<Typography
		variant={`h${level}`}
		sx={{
			...(hidden
				? {
						overflow: 'hidden',
						fontSize: 0,
						textIndent: '101%',
						whiteSpace: 'nowrap',
					}
				: {}),
			...sx,
		}}
	>
		{children}
	</Typography>
);
