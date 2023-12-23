import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
	palette: {
		primary: {
			main: '#874692',
			light: '#6c3a81',
			dark: '#aa75b2',
			contrastText: '#fff',
		},
		secondary: {
			main: '#71b356',
			light: '#4f813a',
			dark: '#b5d8aa',
			contrastText: '#000',
		},
	},
});

const MyApp = ({ Component, pageProps }: AppProps) => (
	<>
		<Head>
			<title>Amethyst</title>
			<meta name="viewport" content="initial-scale=1.0, width=device-width" />
		</Head>
		<ThemeProvider theme={theme}>
			<Component {...pageProps} />
		</ThemeProvider>
	</>
);

export default MyApp;
