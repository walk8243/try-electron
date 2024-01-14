import { ReactNode, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Heading } from './Heading';

export const ErrorFallback = ({ children }: { children: ReactNode }) => {
	const [error, setError] = useState<Error | null>(null);
	useEffect(() => {
		window.error?.show((value) => {
			setError(value);
		});
	}, []);

	if (!error) {
		return <>{children}</>;
	}

	return (
		<Box
			component="section"
			width="100vw"
			maxWidth="600px"
			height="100vh"
			sx={{ overflow: 'hidden' }}
		>
			<Heading level={1} hidden>
				エラー表示
			</Heading>
			<Box
				display="grid"
				height="100%"
				gridTemplateRows="max-content 1fr max-content"
			>
				<Box mx={2} my={1}>
					<Heading level={2}>エラーが発生しました。</Heading>
					<Typography variant="subtitle1">
						GitHubのIssueまでご報告をお願い致します
					</Typography>
					<Typography variant="subtitle1">
						復帰はアプリを再起動してください
					</Typography>
				</Box>
				<ErrorFallbackStack error={error} />
				<LogPath />
			</Box>
		</Box>
	);
};

const ErrorFallbackStack = ({ error }: { error: Error | null }) => {
	if (!error) {
		return <></>;
	}

	return (
		<Box m={2}>
			<Typography component="pre">{error.stack}</Typography>
		</Box>
	);
};

const LogPath = () => {
	const [path, setPath] = useState<string>('');
	useEffect(() => {
		window.error?.getPath().then((value) => setPath(value));
	}, [window.error]);

	return (
		<Box mx={2} my={1} height="1lh">
			<Typography overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
				LogFile: {path}
			</Typography>
		</Box>
	);
};

export default ErrorFallback;
