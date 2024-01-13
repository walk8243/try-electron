import log from 'electron-log';
import { Component } from 'react';
import { Box, Grid, Link, Typography } from '@mui/material';

const ISSUE_URL =
	'https://github.com/walk8243/amethyst-electron/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=';

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
			return (
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
							<Link href={ISSUE_URL}>GitHubのIssue</Link>
							までご報告をお願い致します
						</Typography>
						<Box m={2}>
							{this.state.error ? (
								<Typography>
									{this.state.error.name}: {this.state.error.message}
								</Typography>
							) : (
								<></>
							)}
						</Box>
					</Grid>
				</Grid>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
