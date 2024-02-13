import { Dispatch, createContext } from 'react';
import {
	IconDefinition,
	faInbox,
	faCircleHalfStroke,
	faCodePullRequest,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { safeUnreachable } from '../utils/typescript';
import type { UserInfo } from '../../types/User';
import type { Issue, IssueSupplementMap } from '../../types/Issue';

export const issueFilterAll: IssueFilter = {
	type: 'all',
	title: 'Inbox',
	icon: faInbox,
	filter: (_issue, _option) => true,
	count: (issues, map, option) =>
		countUnreadIssues(issueFilterAll, issues, map, option),
} as const;
export const issueFilterOpen: IssueFilter = {
	type: 'open',
	title: 'Open',
	icon: faCircleHalfStroke,
	filter: (issue, _option) => ['open', 'draft'].includes(issue.state.state),
	count: (issues, map, option) =>
		countUnreadIssues(issueFilterOpen, issues, map, option),
} as const;
export const issueFilterMyIssues: IssueFilter = {
	type: 'my-issues',
	title: 'My Issues',
	icon: faCircleDot,
	filter: (issue, { user }) =>
		issue.state.type === 'issue' && checkOwnIssue(issue, user),
	count: (issues, map, option) =>
		countUnreadIssues(issueFilterMyIssues, issues, map, option),
} as const;
export const issueFilterMyPr: IssueFilter = {
	type: 'my-pr',
	title: 'My PullRequests',
	icon: faCodePullRequest,
	filter: (issue, { user }) =>
		issue.state.type === 'pull-request' && checkOwnIssue(issue, user),
	count: (issues, map, option) =>
		countUnreadIssues(issueFilterMyPr, issues, map, option),
} as const;
export const issueFilters: IssueFilter[] = [
	issueFilterAll,
	issueFilterOpen,
	issueFilterMyIssues,
	issueFilterMyPr,
] as const;

export const IssueFilterContext = createContext<IssueFilter>(issueFilterAll);
export const IssueFilterDispatchContext = createContext<Dispatch<IssueFilter>>(
	(_v) => {},
);

export type IssueFilterTypes = 'all' | 'open' | 'my-issues' | 'my-pr';
type IssueFilterOption = { user: UserInfo | null };

export interface IssueFilter {
	readonly type: IssueFilterTypes;
	readonly title: string;
	readonly icon: IconDefinition;
	readonly filter: (issue: Issue, option: IssueFilterOption) => boolean;
	readonly count: (
		issues: Issue[],
		map: IssueSupplementMap,
		option: IssueFilterOption,
	) => number;
}

export const fromFilterType = (type: IssueFilterTypes): IssueFilter => {
	switch (type) {
		case 'all':
			return issueFilterAll;
		case 'open':
			return issueFilterOpen;
		case 'my-issues':
			return issueFilterMyIssues;
		case 'my-pr':
			return issueFilterMyPr;
	}

	safeUnreachable('IssueFilterTypes', type);
};

const checkOwnIssue = (issue: Issue, user: UserInfo | null) => {
	if (!issue.creator || !user) {
		return false;
	}
	return issue.creator.login === user.login;
};

const countUnreadIssues = (
	issueFilter: IssueFilter,
	issues: Issue[],
	map: IssueSupplementMap,
	option: IssueFilterOption,
): number => {
	return issues
		.filter((issue) => issueFilter.filter(issue, option))
		.filter((issue) => map[issue.key]?.isRead !== true).length;
};
