export const text = {
	light: '#131013',
	dark: '#FFF7FC',
};

export const level = {
	light: {
		strong: '#000000',
		normal: text.light,
		weak: '#494649',
	},
	dark: {
		strong: '#FFFBFF',
		normal: text.dark,
		weak: '#AFA9AE',
	},
};

export default {
	...text,
	level,
};
