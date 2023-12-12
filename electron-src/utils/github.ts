import { net, safeStorage } from 'electron'
import log from 'electron-log/main'
import { store } from './store'

export const getUserInfo = async () => {
	return await accessGithub({ path: 'user' })
}

export const getIssues = async (page: number = 1) => {
	return await accessGithub({ path: 'issues', query: { filter: 'all', state: 'all', sort: 'updated', per_page: 100, page } })
}

export const checkStoreData = () => {
	return store.has('githubBaseUrl') && store.has('githubToken')
}

const accessGithub = async ({ path, query }: { path: string, query?: Record<string, any> }): Promise<Record<string, any>[]> => {
	const url = new URL(path, getBaseUrl())
	url.search = new URLSearchParams(query ?? {}).toString()
	log.verbose('[accessGithub URL]', url.href)
	const response = await net.fetch(url.href, {
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${getToken()}`,
			'X-GitHub-Api-Version': '2022-11-28',
		}
	})
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	return await response.json()
}

const getBaseUrl = () => {
	const baseUrl = store.get('githubBaseUrl')
	if (!baseUrl) {
		throw new Error('No GitHub baseURL set. Please set one in the settings.')
	}

	return baseUrl
}

const getToken = () => {
	const token = store.get('githubToken')
	if (!token) {
		throw new Error('No GitHub token set. Please set one in the settings.')
	}

	return safeStorage.decryptString(Buffer.from(token, 'base64'))
}
