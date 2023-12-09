import { net, safeStorage } from 'electron'
import { store } from './store'

export const getUserInfo = async (url: string) => {
	const token = store.get('githubToken')
	const response = await net.fetch(url, {
		headers: {
			Authorization: `Bearer ${safeStorage.decryptString(Buffer.from(token, 'base64'))}`
		}
	})
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	return await response.json()
}
