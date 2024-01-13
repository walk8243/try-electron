import log from 'electron-log';
import { Component } from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export class ErrorBoundary extends Component<
	{ children: React.ReactNode },
	{ hasError: boolean },
	unknown
> {
	state = { hasError: false };
	static propTypes = {
		children: PropTypes.node,
	};

	static getDerivedStateFromError(_error: unknown) {
		return { hasError: true };
	}

	componentDidCatch(error: Error, _errorInfo: unknown) {
		log.error(`${error.name}: ${error.message}`);
		window.error?.error(error);
	}

	render() {
		if (this.state.hasError) {
			return <Typography variant="h1">エラーが発生しました。</Typography>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
