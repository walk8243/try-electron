import { net, safeStorage } from 'electron'
import log from 'electron-log/main'
import dayjs from 'dayjs'
import { store } from './store'

export const githubAppSettings: { readonly filterTypes: readonly IssueFilterType[], readonly perPage: number, readonly terms: { value: number, unit: dayjs.ManipulateType } } = {
	filterTypes: ['assigned', 'created', 'mentioned'],
	perPage: 100,
	terms: { value: 3, unit: 'month' },
} as const

export const gainUserInfo = async () => {
	return await accessGithub({ path: 'user' })
}

export const gainIssues = async (target?: dayjs.Dayjs) => {
	const since = target?.toISOString() ?? ''
	return Promise.all(githubAppSettings.filterTypes.map((filterType) => gainFilterdIssues(filterType, since))).then((values) => {
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

const gainFilterdIssues = async (filterType: IssueFilterType, since: string) => {
	const issues = []
	for (let page = 1; ; page++) {
		const results = await accessGithub({ path: 'issues', query: { filter: filterType, state: 'all', sort: 'updated', per_page: githubAppSettings.perPage, page, since } })
		issues.push(...results)
		if (results.length < githubAppSettings.perPage) {
			break
		}
	}
	return issues
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

type IssueFilterType = 'assigned' | 'created' | 'mentioned' | 'subscribed' | 'all'
