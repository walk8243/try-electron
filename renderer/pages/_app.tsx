import { Reducer, useMemo, useReducer } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { PaletteMode } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
	ColorModeContext,
	ColorModeDispatchContext,
	colorSetting,
} from '../context/ColorModeContext';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const [mode, dispatch] = useReducer<Reducer<PaletteMode, PaletteMode>>(
		(_prevMode, currentMode) => currentMode,
		'light',
	);
	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					...colorSetting,
					mode,
				},
			}),
		[mode],
	);

	return (
		<>
			<Head>
				<title>Amethyst</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<ColorModeContext.Provider value={mode}>
				<ColorModeDispatchContext.Provider value={dispatch}>
					<ThemeProvider theme={theme}>
						<Component {...pageProps} />
					</ThemeProvider>
				</ColorModeDispatchContext.Provider>
			</ColorModeContext.Provider>
		</>
	);
};

export default MyApp;
