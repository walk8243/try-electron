export const safeUnreachable = (type: string, x: never): never => {
	throw new Error(`Unreachable code ${type}: ${JSON.stringify(x)}`);
};
