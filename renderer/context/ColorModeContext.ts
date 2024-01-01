import { Dispatch, createContext } from 'react';
import type { PaletteMode, PaletteOptions } from '@mui/material';
import { grey } from '@mui/material/colors';
import { error } from '../styles/colors/error';
import { primary } from '../styles/colors/primary';
import { secondary } from '../styles/colors/secondary';
import { tertiary } from '../styles/colors/tertiary';

export const ColorModeContext = createContext<PaletteMode>('light');
export const ColorModeDispatchContext = createContext<Dispatch<PaletteMode>>(
	(_v) => {},
);

export const colorSetting: PaletteOptions = {
	primary: {
		main: primary.key,
		light: primary.light.main,
		dark: primary.dark.main,
		contrastText: '#fff',
	},
	secondary: {
		main: secondary.key,
		light: secondary.light.main,
		dark: secondary.dark.main,
		contrastText: '#000',
	},
	tertiary: {
		main: tertiary.key,
		light: tertiary.light.main,
		dark: tertiary.dark.main,
		contrastText: '#000',
	},
	error: {
		main: error.key,
		light: error.light.main,
		dark: error.dark.main,
		contrastText: '#fff',
	},
	ordinarily: {
		main: grey[500],
		light: grey[300],
		dark: grey[700],
		contrastText: '#fff',
	},
};
