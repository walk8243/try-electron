const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

console.log('');
const main = () => {
	const result = {
		...collectDependencyVersions(),
		...collectElectronEnvVersions(),
	};

	console.log('## Electron Environment');
	console.log('| OSS | Version |');
	console.log('|:---|---:|');
	console.log(`| Electron | ${result.electron} |`);
	console.log(`| Chromium | ${result.chromium} |`);
	console.log(`| Node.js | ${result.node} |`);
	console.log(`| React | ${result.react} |`);
	console.log(`| Next.js | ${result.next} |`);
	console.log(`| Material UI | ${result.mui} |`);
};

const collectDependencyVersions = () => {
	const result = JSON.parse(execSync('npm ls --json').toString());
	return {
		electron: result.dependencies.electron.version,
		react: result.dependencies.react.version,
		next: result.dependencies.next.version,
		mui: result.dependencies['@mui/material'].version,
	};
};

const collectElectronEnvVersions = () => {
	const filepath = path.resolve(process.cwd(), 'DEPS');
	const deps = fs.readFileSync(filepath).toString();
	const lines = deps.split('\n');

	return {
		chromium: extraVerion('chromium', lines),
		node: extraVerion('node', lines),
	};
};

const extraVerion = (target, lines) => {
	for (let i=0; i<lines.length; i++) {
		if (lines[i].includes(`${target}_version`)) {
			const result = /'v?(?<version>.+)'/g.exec(lines[i+1]);
			return result.groups.version;
		}
	}
};

main();
