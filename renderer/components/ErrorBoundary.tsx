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
		window.error?.throw(error);
		return {};
	}

	render() {
		return this.props.children;
	}
}

export default ErrorBoundary;
