import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
	Box,
	Button,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { Heading } from '../components/Heading';
import type { SettingData } from '../../types/Setting';

const SettingPage = () => {
	const [data, setData] = useState<SettingData>({ url: '' });
	useEffect(() => {
		window.setting
			?.display()
			.then((data) => {
				if (data) {
					setData(() => data);
				}
			})
			.catch(console.error);
	}, []);

	const handleSubmit = () => {
		window.setting?.submit({
			token: data.token,
			url: data.url,
		});
	};
	const handleCancel = () => {
		window.setting?.cancel();
	};

	return (
		<>
			<Head>
				<title>設定</title>
			</Head>
			<Heading level={1} hidden>
				設定
			</Heading>

			<Box component="section">
				<Heading level={2}>設定</Heading>
				<TableContainer>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>
									<Typography>URL</Typography>
								</TableCell>
								<TableCell>
									<TextField
										value={data.url}
										onChange={(e) =>
											setData(() => ({ ...data, url: e.target.value }))
										}
										variant="standard"
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Typography>token</Typography>
								</TableCell>
								<TableCell>
									<TextField
										type="password"
										value={data.token}
										onChange={(e) =>
											setData(() => ({ ...data, token: e.target.value }))
										}
										variant="standard"
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</TableContainer>
			</Box>

			<Box component="section" mt={3}>
				<Heading level={2} hidden>
					操作ボタン
				</Heading>
				<Grid container justifyContent="center" gap={2}>
					<Grid item>
						<Button variant="contained" onClick={handleSubmit}>
							保存
						</Button>
					</Grid>
					<Grid item>
						<Button variant="outlined" onClick={handleCancel}>
							キャンセル
						</Button>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default SettingPage;
