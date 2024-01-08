import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { Heading } from '../components/Heading';
import { ColorModeContext } from '../context/ColorModeContext';
import {
	Box,
	Button,
	Grid,
	IconButton,
	Link,
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
			Amethyst Update
		</Heading>

		<Box component="section" m={2}>
			<Heading level={2} hidden>
				更新情報
			</Heading>

			<UpdateInfo />
			<HowToUpdate />
		</Box>

		<ButtonArea />
	</Box>
);

const UpdateInfo = () => {
	const [tag, setTag] = useState('');
	useEffect(() => {
		window.update?.version().then((version) => {
			setTag(version);
		});
	}, []);

	const handleClick = () => {
		window.update?.openRelease();
	};

	return (
		<Box component="section">
			<Heading level={3}>更新情報</Heading>

			<Typography>現在の最新バージョンは {tag} です。</Typography>
			<Typography>
				詳細は
				<Link component="button" onClick={handleClick}>
					Release Notes
				</Link>
				をご覧ください。
			</Typography>
		</Box>
	);
};

const HowToUpdate = () => {
	return (
		<Box component="section">
			<Heading level={3} hidden>
				更新方法
			</Heading>

			<HowToUpdateSwitch />
		</Box>
	);
};
const HowToUpdateSwitch = () => {
	if (process.platform === 'win32') {
		return <HowToUpdateForWindows />;
	}
	if (process.platform === 'darwin') {
		return <HowToUpdateForMac />;
	}
	return <HowToUpdateForOther />;
};

const HowToUpdateForWindows = () => {
	const handleClick = () => {
		window.update?.download();
	};

	return (
		<Box component="section">
			<Heading level={4} hidden>
				Windowsの場合の更新方法
			</Heading>

			<Grid container justifyContent="center" m={2} width="auto">
				<Grid item width="100%">
					<Typography>
						以下のボタンから最新のMSIファイルをダウンロードしてください。
					</Typography>
				</Grid>
				<Grid item mb={1}>
					<Button onClick={handleClick} variant="contained" color="primary">
						最新のMSIファイルをダウンロード
					</Button>
				</Grid>
				<Grid item width="100%">
					<Typography>
						ダウンロードが完了したら、エクスプローラーからMSIファイルを実行してください。
					</Typography>
				</Grid>
			</Grid>
		</Box>
	);
};

const HowToUpdateForMac = () => {
	const colorMode = useContext(ColorModeContext);

	return (
		<Box component="section">
			<Heading level={4} hidden>
				MacOSの場合の更新方法
			</Heading>

			<Grid container justifyContent="center" m={2} width="auto">
				<Grid item width="100%">
					<Typography>
						HomebrewのCaskファイルを読み込みなおして、Amethystをアップデートしてください。
					</Typography>
				</Grid>
				<Grid item width="100%">
					<Paper
						elevation={0}
						sx={{
							position: 'relative',
							p: 1,
							color: codeColor[colorMode].on,
							bgcolor: codeColor[colorMode].main,
							borderRadius: 1,
						}}
					>
						<Box component="code">
							<Typography>brew update</Typography>
							<Typography>
								brew upgrade --cask @walk8243/cask/amethyst
							</Typography>
						</Box>
						<Box
							sx={{ position: 'absolute', top: 0, right: 0, lineHeight: '1em' }}
						>
							<IconButton
								sx={{ fontSize: 'inherit', color: codeColor[colorMode].on }}
							>
								<FontAwesomeIcon icon={faClipboard} />
							</IconButton>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
};

const HowToUpdateForOther = () => {
	const handleClick = () => {
		window.update?.openLink(
			'https://walk8243.github.io/amethyst-electron/detail/developer.html',
		);
	};

	return (
		<Box component="section">
			<Heading level={4} hidden>
				その他の場合の更新方法
			</Heading>

			<Typography>
				以下ドキュメントを参考に、ご自身でビルドしなおしてください。
			</Typography>
			<Grid container justifyContent="center" m={2} width="auto">
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={handleClick}
						sx={{ textTransform: 'none' }}
					>
						開発者向け | Amethyst
					</Button>
				</Grid>
			</Grid>
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
