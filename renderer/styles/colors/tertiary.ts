export const tertiary = {
	light: {
		main: '#815252',
		on: '#FFFFFF',
	},
	dark: {
		main: '#F4B7B7',
		on: '#4C2526',
	},
};

export const container = {
	light: {
		main: '#FFDAD9',
		on: '#331112',
	},
	dark: {
		main: '#663B3B',
		on: '#FFDAD9',
	},
};

export const fixed = {
	light: {
		main: '#FFDAD9',
		on: '#331112',
		dim: '#F4B7B7',
		onVariant: '#663B3B',
	},
	dark: {
		main: '#FFDAD9',
		on: '#331112',
		dim: '#F4B7B7',
		onVariant: '#663B3B',
	},
};

export default {
	...tertiary,
	container,
	fixed,
};
