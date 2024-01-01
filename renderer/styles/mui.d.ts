import '@mui/material';

declare module '@mui/material/styles' {
	interface Palette {
		tertiary: Palette['primary'];
		ordinarily: Palette['primary'];
	}
	interface PaletteOptions {
		tertiary?: PaletteOptions['primary'];
		ordinarily?: PaletteOptions['primary'];
	}
}

declare module '@mui/material/Badge' {
	interface BadgePropsColorOverrides {
		ordinarily: true;
	}
}
