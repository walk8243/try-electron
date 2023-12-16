export const safeUnreachable = (_x: never): never => {
	throw new Error('Unreachable code');
};
