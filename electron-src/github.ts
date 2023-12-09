import { net } from 'electron'

export const getUserInfo = async (url: string) => {
	const response = await net.fetch(url, {
		headers: {
			Authorization: `Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
		}
	})
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	return await response.json()
}
