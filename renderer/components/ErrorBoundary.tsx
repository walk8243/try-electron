import { Component } from 'react';

export class ErrorBoundary extends Component<
	{ children: React.ReactNode },
	object,
	unknown
> {
	constructor(props: { children: React.ReactNode }) {
		super(props);
	}

	static getDerivedStateFromError(error: Error) {
		window.error?.throw({
			name: error.name,
			message: error.message,
			stack: error.stack ?? `${error.name}: ${error.message}`,
		});
		return {};
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;
