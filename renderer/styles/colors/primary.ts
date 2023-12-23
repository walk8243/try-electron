export const primary = {
	light: {
		main: '#745086',
		on: '#FFFFFF',
	},
	dark: {
		main: '#E2B7F4',
		on: '#432255',
	},
};

export const container = {
	light: {
		main: '#F6D9FF',
		on: '#2C0B3E',
	},
	dark: {
		main: '#5B396D',
		on: '#F6D9FF',
	},
};

export const fixed = {
	light: {
		main: '#F6D9FF',
		on: '#2C0B3E',
		dim: '#E2B7F4',
		onVariant: '#5B396D',
	},
	dark: {
		main: '#F6D9FF',
		on: '#2C0B3E',
		dim: '#E2B7F4',
		onVariant: '#5B396D',
	},
};

export const inverse = {
	light: '#E2B7F4',
	dark: '#745086',
};

export default {
	...primary,
	container,
	fixed,
	inverse,
};
