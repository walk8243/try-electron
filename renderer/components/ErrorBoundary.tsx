import { Component, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Heading } from './Heading';

export class ErrorBoundary extends Component<
	{ children: React.ReactNode },
	{ hasError: boolean; error: Error | null },
	unknown
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, _errorInfo: unknown) {
		window.error?.throw(error);
	}

	render() {
		if (this.state.hasError) {
			return <ErrorFallback error={this.state.error} />;
		}

		return this.props.children;
	}
}

const ErrorFallback = ({ error }: { error: Error | null }) => (
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

export default ErrorBoundary;
