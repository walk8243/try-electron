import type { AppProps } from 'next/app';
import Head from 'next/head';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
	<>
		<Head>
			<title>Amethyst</title>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</Head>
		<Component {...pageProps} />
	</>
);

export default MyApp;
