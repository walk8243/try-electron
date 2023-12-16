import Image from 'next/image';
import Head from 'next/head';
import {
	Box,
	Button,
	Grid,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Heading } from '../components/Heading';
import appIcon from '../../docs/img/icon.png';

const AboutPage = () => (
	<Box sx={{ overflow: 'hidden', mt: -3 }}>
		<Head>
			<title>このアプリについて</title>
		</Head>
		<Heading level={1} hidden>
			Amethyst
		</Heading>

		<AppInfo />
		<ButtonArea />
		<OssList />
		<CopyRight />
	</Box>
);

const AppInfo = () => {
	const handleOpenSource = (url: string) => {
		window.about?.open(url);
	};

	return (
		<Box component="section" my={3}>
			<Heading level={2} hidden>
				アプリケーションの情報
			</Heading>

			<Grid container alignItems="center" gap={2} sx={{ px: 1 }}>
				<Grid item xs="auto">
					<Image
						alt="app icon"
						src={appIcon}
						width={100}
						height={100}
						style={{ marginLeft: 'auto', marginRight: 'auto' }}
						placeholder="blur"
					/>
				</Grid>
				<Grid container item direction="column" xs zeroMinWidth gap={2}>
					<Grid container item alignItems="flex-end" gap={1}>
						<Grid item>
							<Typography variant="h3">Amethyst</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle1">v0.0.1</Typography>
						</Grid>
					</Grid>
					<Grid item>
						<Typography>
							関係しているGitHubのIssuesを表示・管理するデスクトップアプリ
						</Typography>
					</Grid>
					<Grid item>
						<Link
							component="button"
							onClick={() =>
								handleOpenSource(
									'https://github.com/walk8243/amethyst-electron',
								)
							}
						>
							<FontAwesomeIcon icon={faGithub} style={{ marginRight: 8 }} />
							walk8243/amethyst-electron
						</Link>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

const OssData: OssInfoProps[] = [
	{ name: 'Node.js', version: '18.18.2' },
	{ name: 'Electron', version: '28.0.0' },
	{ name: 'React', version: '18.2.0' },
	{ name: 'Next.js', version: '14.0.4' },
	{ name: 'Chronium', version: '120.0.6099.56' },
	{ name: 'Material UI', version: '5.15.0' },
];
const OssList = () => (
	<Box component="section" my={3}>
		<Heading level={2} hidden>
			使用しているOSSの一覧
		</Heading>

		<TableContainer component={Paper}>
			<Table>
				<TableHead>{OssInfo({ name: 'OSS', version: 'Version' })}</TableHead>
				<TableBody>
					{OssData.map((data, index) => (
						<OssInfo key={index} {...data} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	</Box>
);
const OssInfo = ({ name, version }: OssInfoProps) => (
	<TableRow>
		<TableCell>{name}</TableCell>
		<TableCell>{version}</TableCell>
	</TableRow>
);
type OssInfoProps = {
	name: string;
	version: string;
};

const ButtonArea = () => {
	const handleClose = () => {
		window.about?.close();
	};

	return (
		<Box component="section" my={3}>
			<Heading level={2} hidden>
				ボタン配置領域
			</Heading>

			<Grid container my={3} justifyContent="center">
				<Grid item>
					<Button variant="outlined" onClick={handleClose}>
						閉じる
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

const CopyRight = () => (
	<Box component="section" mt={3}>
		<Heading level={2} hidden>
			著作権情報
		</Heading>

		<Grid container justifyContent="center">
			<Grid item>
				<Typography
					variant="caption"
					sx={{ '::before': { content: '"©"', mr: 0.5 } }}
				>
					walk8243
				</Typography>
			</Grid>
		</Grid>
	</Box>
);

export default AboutPage;
