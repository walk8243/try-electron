import { useContext } from 'react';
import Head from 'next/head';
import { Heading } from '../components/Heading';
import { ColorModeContext } from '../context/ColorModeContext';
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
import codeColor from '../styles/colors/code';

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

		<ButtonArea />
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
	const handleClick = () => {
		window.update?.download();
	};

	return (
		<Box component="section">
			<Heading level={3} hidden>
				Windowsの場合の更新方法
			</Heading>

			<Grid container justifyContent="center" m={2}>
				<Grid item>
					<Button onClick={handleClick} variant="contained" color="primary">
						最新のMSIファイルをダウンロード
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

const HowToUpdateForMac = () => {
	const colorMode = useContext(ColorModeContext);

	return (
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
					color: codeColor[colorMode].on,
					bgcolor: codeColor[colorMode].main,
					borderRadius: 1,
				}}
			>
				<Box component="code">
					<Typography>brew update</Typography>
					<Typography>brew upgrade --cask @walk8243/cask/amethyst</Typography>
				</Box>
				<Box sx={{ position: 'absolute', top: 5, right: 5, lineHeight: '1em' }}>
					<IconButton
						sx={{ fontSize: 'inherit', color: codeColor[colorMode].on }}
					>
						<FontAwesomeIcon icon={faClipboard} />
					</IconButton>
				</Box>
			</Paper>
		</Box>
	);
};

const ButtonArea = () => {
	const handleClose = () => {
		window.update?.close();
	};

	return (
		<Box component="section" my={3}>
			<Heading level={2} hidden>
				ボタン配置領域
			</Heading>

			<Grid container justifyContent="center">
				<Grid item>
					<Button variant="outlined" onClick={handleClose}>
						閉じる
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

export default UpdatePage;
