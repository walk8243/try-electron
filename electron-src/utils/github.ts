import { net, safeStorage } from 'electron'
import log from 'electron-log/main'
import dayjs from 'dayjs'
import { translateUserInfo, translateIssues } from '../tanslators/GithubTranslator'
import { store } from './store'
import type { GithubUserInfo, GithubIssue } from '../types/GitHub'
import type { UserInfo } from '../../types/User'
import type { Issue } from '../../types/Issue'

export const githubAppSettings: { readonly filterTypes: readonly IssueFilterType[], readonly perPage: number, readonly terms: { value: number, unit: dayjs.ManipulateType } } = {
	filterTypes: ['assigned', 'created', 'mentioned'],
	perPage: 100,
	terms: { value: 3, unit: 'month' },
} as const

export const gainUserInfo = async (): Promise<UserInfo> => {
	const result = await accessGithub({ path: 'user' })
	if (!isUserInfoType(result)) {
		throw new Error('GitHub APIからの認証されたユーザのresponseが異常値です')
	}
	return translateUserInfo(result)
}

export const gainIssues = async (target?: dayjs.Dayjs): Promise<Issue[]> => {
	const since = target?.toISOString() ?? ''
	return Promise.all(githubAppSettings.filterTypes.map((filterType) => gainFilterdIssues(filterType, since))).then((values) => {
		return values.reduce((acc, cur) => acc.concat(cur), [])
			.reduce((acc: GithubIssue[], cur: GithubIssue) => {
				if (acc.every((issue) => issue.node_id !== cur.node_id)) {
					acc.push(cur)
				}
				return acc
			}, [])
	})
		.then((issues) => issues.toSorted((a, b) => dayjs(a.updated_at).isBefore(dayjs(b.updated_at)) ? 1 : -1))
		.then(translateIssues)
}

export const checkStoreData = () => {
	return store.has('githubBaseUrl') && store.has('githubToken')
}

const gainFilterdIssues = async (filterType: IssueFilterType, since: string): Promise<GithubIssue[]> => {
	const issues = []
	for (let page = 1; ; page++) {
		const results = await accessGithub({ path: 'issues', query: { filter: filterType, state: 'all', sort: 'updated', per_page: githubAppSettings.perPage, page, since } })
		if (!isIssuesType(results)) {
			throw new Error('GitHub APIからのIssueのresponseが異常値です')
		}
		issues.push(...results)
		if (results.length < githubAppSettings.perPage) {
			break
		}
	}
	return issues
}

const accessGithub = async ({ path, query }: { path: string, query?: Record<string, any> }): Promise<unknown> => {
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

const isUserInfoType = (target: unknown): target is GithubUserInfo => {
	if (target === null || typeof target !== 'object') {
		return false
	}
	return 'id' in target && 'node_id' in target && 'login' in target && 'avatar_url' in target && 'html_url' in target && 'url' in target && 'created_at' in target && 'updated_at' in target
}
const isIssuesType = (target: unknown): target is GithubIssue[] => {
	if (!Array.isArray(target)) {
		return false
	}

	return target.every((issue) => isIssueType(issue))
}
const isIssueType = (target: unknown): target is GithubIssue => {
	if (target === null || typeof target !== 'object') {
		return false
	}
	return 'id' in target && 'node_id' in target && 'url' in target && 'title' in target && 'html_url' in target && 'state' in target && 'labels' in target && 'created_at' in target && 'updated_at' in target
}

type IssueFilterType = 'assigned' | 'created' | 'mentioned' | 'subscribed' | 'all'
