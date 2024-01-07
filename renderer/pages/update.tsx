import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Heading } from '../components/Heading';
import {
	Box,
	Button,
	Grid,
	IconButton,
	Paper,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';

const UpdatePage = () => (
	<Box sx={{ overflow: 'hidden' }}>
		<Head>
			<title>Amethyst Update</title>
		</Head>
		<Heading level={1} hidden>
			更新方法
		</Heading>

		<Box component="section">
			<Heading level={2} hidden>
				更新方法
			</Heading>

			<HowToUpdate />
		</Box>
	</Box>
);

const HowToUpdate = () => {
	return (
		<Box>
			<HowToUpdateForWindows />
			<HowToUpdateForMac />
		</Box>
	);
};

const HowToUpdateForWindows = () => {
	const [version, setVersion] = useState<{
		url: string;
		filename: string;
	} | null>(null);
	useEffect(() => {
		window.update?.version().then((tag) =>
			setVersion({
				url: `https://github.com/walk8243/amethyst-electron/releases/download/${tag}/amethyst-${tag}-win.msi`,
				filename: `amethyst-${tag}-win.msi`,
			}),
		);
	}, []);

	return (
		<Box component="section">
			<Heading level={3} hidden>
				Windowsの場合の更新方法
			</Heading>

			<Grid container justifyContent="center" m={2}>
				{version ? (
					<DownloadButton url={version.url} filename={version.filename} />
				) : (
					<></>
				)}
			</Grid>
		</Box>
	);
};

const HowToUpdateForMac = () => (
	<Box component="section">
		<Heading level={3} hidden>
			MacOSの場合の更新方法
		</Heading>

		<Paper
			elevation={0}
			sx={{
				position: 'relative',
				m: 2,
				p: 1,
				color: '#939bc1',
				bgcolor: 'navy',
				borderRadius: 1,
			}}
		>
			<Box component="code">
				<Typography>brew update</Typography>
				<Typography>brew upgrade --cask @walk8243/cask/amethyst</Typography>
			</Box>
			<Box sx={{ position: 'absolute', top: 5, right: 5, lineHeight: '1em' }}>
				<IconButton color="primary" sx={{ fontSize: 'inherit' }}>
					<FontAwesomeIcon icon={faClipboard} />
				</IconButton>
			</Box>
		</Paper>
	</Box>
);

const DownloadButton = ({
	url,
	filename,
}: {
	url: string;
	filename: string;
}) => (
	<Grid item>
		<Button
			href={url}
			variant="contained"
			color="primary"
			sx={{ textTransform: 'none' }}
		>
			{filename}
		</Button>
	</Grid>
);

export default UpdatePage;
