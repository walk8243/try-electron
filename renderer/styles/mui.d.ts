import '@mui/material';

declare module '@mui/material/styles' {
	interface Palette {
		ordinarily: Palette['primary'];
	}
	interface PaletteOptions {
		ordinarily?: PaletteOptions['primary'];
	}
}

declare module '@mui/material/Badge' {
	interface BadgePropsColorOverrides {
		ordinarily: true;
	}
}
