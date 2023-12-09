import { net, safeStorage } from 'electron'
import { store } from './store'

export const getUserInfo = async () => {
	return await accessGithub('/user')
}

const accessGithub = async (path: string) => {
	const response = await net.fetch(`https://${getHostname()}${path}`, {
		headers: {
			Authorization: `Bearer ${getToken()}`
		}
	})
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	return await response.json()
}

const getHostname = () => {
	const hostname = store.get('githubHostname')
	if (!hostname) {
		throw new Error('No GitHub hostname set. Please set one in the settings.')
	}

	return hostname
}

const getToken = () => {
	const token = store.get('githubToken')
	return safeStorage.decryptString(Buffer.from(token, 'base64'))
}
