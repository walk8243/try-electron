import { Dispatch, createContext } from 'react';
import type { PaletteMode, PaletteOptions } from '@mui/material';
import { error } from '../styles/colors/error';
import { primary } from '../styles/colors/primary';
import { secondary } from '../styles/colors/secondary';

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
	error: {
		main: error.key,
		light: error.light.main,
		dark: error.dark.main,
		contrastText: '#fff',
	},
};
