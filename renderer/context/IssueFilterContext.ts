import { Dispatch, createContext } from 'react'
import { IconDefinition, faInbox, faCircleHalfStroke, faCodePullRequest } from '@fortawesome/free-solid-svg-icons'
import { faCircleDot } from '@fortawesome/free-regular-svg-icons'
import { safeUnreachable } from '../utils/typescript'
import type { UserInfo } from '../../types/User'
import type { Issue } from '../../types/Issue'

export const issueFilterAll: IssueFilter = {
	type: 'all',
	title: 'Inbox',
	icon: faInbox,
	filter: (_issue, _option) => true,
} as const
export const issueFilterOpen: IssueFilter = {
	type: 'open',
	title: 'Open',
	icon: faCircleHalfStroke,
	filter: (issue, _option) => ['open', 'draft'].includes(issue.state.state),
} as const
export const issueFilterMyIssues: IssueFilter = {
	type: 'my-issues',
	title: 'My Issues',
	icon: faCircleDot,
	filter: (issue, { user }) => issue.state.type === 'issue' && checkOwnIssue(issue, user),
} as const
export const issueFilterMyPr: IssueFilter = {
	type: 'my-pr',
	title: 'My PullRequests',
	icon: faCodePullRequest,
	filter: (issue, { user }) => issue.state.type === 'pull-request' && checkOwnIssue(issue, user),
} as const
export const issueFilters: IssueFilter[] = [
	issueFilterAll,
	issueFilterOpen,
	issueFilterMyIssues,
	issueFilterMyPr,
] as const

export const IssueFilterContext = createContext<IssueFilter>(issueFilterAll)
export const IssueFilterDispatchContext = createContext<Dispatch<IssueFilter>>((_v) => { })

export type IssueFilterTypes = 'all' | 'open' | 'my-issues' | 'my-pr'
type IssueFilterOption = { user: UserInfo | null }

export interface IssueFilter {
	readonly type: IssueFilterTypes
	readonly title: string
	readonly icon: IconDefinition
	readonly filter: (issue: Issue, option: IssueFilterOption) => boolean
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

const checkOwnIssue = (issue: Issue, user: UserInfo | null) => {
	if (!issue.user || !user) {
		return false
	}
	return issue.user === user.login
}
