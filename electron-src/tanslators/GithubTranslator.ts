import type { Issue, IssueLabel, IssueState } from '../../types/Issue'
import type { UserInfo } from '../../types/User'
import type { RecordValue } from '../../types/Utility'
import type { GithubUserInfo, GithubIssue, GithubLabel } from '../types/GitHub'

export const translateUserInfo = (userInfo: GithubUserInfo): UserInfo => ({
	login: userInfo.login,
	avatarUrl: userInfo.avatar_url,
	name: userInfo.name,
})

export const translateIssues = (issues: GithubIssue[]): Issue[] => issues.map(translateIssue)
export const translateIssue = (issue: GithubIssue): Issue => ({
	id: issue.id,
	key: issue.node_id,
	title: issue.title,
	url: issue.html_url,
	repositoryName: issue.repository ? issue.repository.full_name : '',
	state: translateIssueState(issue),
	labels: translateIssueLabels(issue.labels),
	reactions: issue.reactions ? issue.reactions.total_count : 0,
	user: issue.user ? issue.user.login : null,
	updatedAt: issue.updated_at,
})

const translateIssueState = (issue: GithubIssue): IssueState => {
	if (issue.pull_request) {
		return {
			type: 'pull-request',
			state: translatePullRequestState(issue),
		}
	}

	return {
		type: 'issue',
		state: issue.state,
	}
}
const translatePullRequestState = (issue: GithubIssue): RecordValue<Extract<IssueState, { type: 'pull-request' }>, 'state'> => {
	if (issue.draft) {
		return 'draft'
	}
	if (issue.pull_request?.merged_at) {
		return 'merged'
	}
	return issue.state
}

const translateIssueLabels = (labels: string[] | GithubLabel[]): IssueLabel[] => {
	return labels.map(translateIssueLabel)
}
const translateIssueLabel = (label: string | GithubLabel): IssueLabel => {
	if (typeof label === 'string') {
		return {
			key: null,
			text: label,
			color: null,
		}
	}

	return {
		key: label.node_id,
		text: label.name,
		color: label.color,
	}
}
