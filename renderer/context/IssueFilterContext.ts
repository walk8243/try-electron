import { Dispatch, createContext } from 'react'
import { GithubIssue, GithubUserInfo } from '../../types/Github'

export const issueFilterAll: IssueFilter = {
	type: 'all',
	title: 'Inbox',
	filter: (_issue, _option) => true,
} as const
export const issueFilterOpen: IssueFilter = {
	type: 'open',
	title: 'Open',
	filter: (issue, _option) => issue.state === 'open',
} as const
export const issueFilterMyIssues: IssueFilter = {
	type: 'my-issues',
	title: 'My Issues',
	filter: (issue, { user }) => !Object.hasOwn(issue, 'pull_request') && issue.user.login === user.login,
} as const
export const issueFilterMyPr: IssueFilter = {
	type: 'my-pr',
	title: 'My PullRequests',
	filter: (issue, { user }) => Object.hasOwn(issue, 'pull_request') && issue.user.login === user.login,
} as const
export const issueFilters: IssueFilter[] = [
	issueFilterAll,
	issueFilterOpen,
	issueFilterMyIssues,
	issueFilterMyPr,
] as const

export const IssueFilterContext = createContext<IssueFilter>(null)
export const IssueFilterDispatchContext = createContext<Dispatch<IssueFilter>>(null)

export type IssueFilterTypes = 'all' | 'open' | 'my-issues' | 'my-pr'

export interface IssueFilter {
	readonly type: IssueFilterTypes
	readonly title: string
	readonly filter: (issue: GithubIssue, option?: { user: GithubUserInfo }) => boolean
}

export const fromFilterType = (type: IssueFilterTypes): IssueFilter => {
	switch (type) {
		case 'all':
			return issueFilterAll
		case 'open':
			return issueFilterOpen
		case 'my-issues':
			return issueFilterMyIssues
		case 'my-pr':
			return issueFilterMyPr
	}

	safeUnreachable(type)
}

export const safeUnreachable = (_x: never): never => {
	throw new Error('Unreachable code')
}
