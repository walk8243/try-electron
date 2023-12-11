import isDev from 'electron-is-dev'

const serverModeBaseUrl = 'http://localhost:8000/'

export const getLoadedUrl = (path?: string) => {
	if (isDev) {
		return serverModeBaseUrl + (path ?? '')
	}

	const url = new URL(`../renderer/out/${(path ?? 'index')}.html`, `file://${__dirname}`)
	return url.href
}
