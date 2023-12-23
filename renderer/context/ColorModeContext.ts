import { Dispatch, createContext } from 'react';
import type { PaletteMode, PaletteOptions } from '@mui/material';

export const ColorModeContext = createContext<PaletteMode>('light');
export const ColorModeDispatchContext = createContext<Dispatch<PaletteMode>>(
	(_v) => {},
);

export const colorSetting: PaletteOptions = {
	primary: {
		main: '#61337A',
		light: '#61337A',
		dark: '#aa75b2',
		contrastText: '#fff',
	},
	secondary: {
		main: '#9B8BA0',
		light: '#9B8BA0',
		dark: '#b5d8aa',
		contrastText: '#000',
	},
	error: {
		main: '#FF5449',
		light: '#FF5449',
	},
};
