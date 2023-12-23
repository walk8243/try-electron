export const secondary = {
	key: '#9B8BA0',
	light: {
		main: '#745186',
		on: '#FFFFFF',
	},
	dark: {
		main: '#E1B7F5',
		on: '#432255',
	},
};

export const container = {
	light: {
		main: '#F5D9FF',
		on: '#2C0B3E',
	},
	dark: {
		main: '#5B396D',
		on: '#F5D9FF',
	},
};

export const fixed = {
	light: {
		main: '#F5D9FF',
		on: '#2C0B3E',
		dim: '#E1B7F5',
		onVariant: '#5B396D',
	},
	dark: {
		main: '#F5D9FF',
		on: '#2C0B3E',
		dim: '#E1B7F5',
		onVariant: '#5B396D',
	},
};

export default {
	...secondary,
	container,
	fixed,
};
