import { Dispatch, createContext } from 'react';
import type { PaletteMode } from '@mui/material';

export const ColorModeContext = createContext<PaletteMode>('light');
export const ColorModeDispatchContext = createContext<Dispatch<PaletteMode>>(
	(_v) => {},
);
