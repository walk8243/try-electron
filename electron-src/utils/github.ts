import { net, safeStorage } from 'electron'
import log from 'electron-log/main'
import dayjs from 'dayjs'
import { store } from './store'

export const getUserInfo = async () => {
	return await accessGithub({ path: 'user' })
}

export const getIssues = async () => {
	return Promise.all([
		accessGithub({ path: 'issues', query: { filter: 'assigned', state: 'all', sort: 'updated', per_page: 100, page: 1 } }),
		accessGithub({ path: 'issues', query: { filter: 'created', state: 'all', sort: 'updated', per_page: 100, page: 1 } }),
		accessGithub({ path: 'issues', query: { filter: 'mentioned', state: 'all', sort: 'updated', per_page: 100, page: 1 } }),
	]).then((values) => {
		return values.reduce((acc, cur) => acc.concat(cur), [])
			.reduce((acc: Record<string, any>[], cur: Record<string, any>) => {
				if (acc.every((issue) => issue.node_id !== cur.node_id)) {
					acc.push(cur)
				}
				return acc
			}, [])
	}).then((issues) => issues.sort((a, b) => dayjs(a.updated_at).isBefore(dayjs(b.updated_at)) ? 1 : -1))
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
