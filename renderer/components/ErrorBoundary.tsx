import log from 'electron-log';
import { Component } from 'react';
import { Box, Grid, Typography } from '@mui/material';

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
		log.error(`${error.name}: ${error.message}`);
		window.error?.error(error);
	}

	render() {
		if (this.state.hasError) {
			return <ErrorFallback error={this.state.error} />;
		}

		return this.props.children;
	}
}

const ErrorFallback = ({ error }: { error: Error | null }) => (
	<Grid
		container
		width="100vw"
		maxWidth="600px"
		height="100%"
		justifyContent="center"
		sx={{ overflow: 'hidden' }}
	>
		<Grid item width="100%">
			<Typography variant="h1">エラーが発生しました。</Typography>
			<Typography variant="subtitle1">
				GitHubのIssueまでご報告をお願い致します
			</Typography>
		</Grid>
		<Grid item width="100%">
			<ErrorFallbackStack error={error} />
		</Grid>
	</Grid>
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

export default ErrorBoundary;
