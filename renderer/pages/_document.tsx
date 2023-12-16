import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<meta charSet="utf-8" />
				<link
					rel="stylesheet"
					href="https://unpkg.com/modern-css-reset/dist/reset.min.css"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
