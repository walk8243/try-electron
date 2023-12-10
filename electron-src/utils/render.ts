import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import isDev from 'electron-is-dev'

const serverModeBaseUrl = 'http://localhost:8000/'

export const getLoadedUrl = (path?: string) => {
	if (isDev) {
		return serverModeBaseUrl + (path ?? '')
	}

	return fileURLToPath(join(__dirname, '../renderer/out/', `${(path ?? 'index')}.html`))
}
