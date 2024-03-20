import { Dispatch, createContext } from 'react';
import {
	IconDefinition,
	faInbox,
	faCircleHalfStroke,
	faCodePullRequest,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { safeUnreachable } from '../utils/typescript';
import {
	issueFilterAllFunction,
	issueFilterOpenFunction,
	issueFilterMyIssuesFunction,
	issueFilterMyPrFunction,
} from '../utils/IssueFilter';
import type { Issue, IssueSupplementMap } from '../../types/Issue';
import type {
	IssueFilterTypes,
	IssueFilterFunction,
	IssueFilterOption,
} from '../../types/IssueFilter';

export const issueFilterAll: IssueFilter = {
	type: 'all',
	title: 'Inbox',
	icon: faInbox,
	filter: issueFilterAllFunction,
	count: (issues, map, option) =>
		countUnreadIssues(issueFilterAll, issues, map, option),
} as const;
export const issueFilterOpen: IssueFilter = {
	type: 'open',
	title: 'Open',
	icon: faCircleHalfStroke,
	filter: issueFilterOpenFunction,
	count: (issues, map, option) =>
		countUnreadIssues(issueFilterOpen, issues, map, option),
} as const;
export const issueFilterMyIssues: IssueFilter = {
	type: 'my-issues',
	title: 'My Issues',
	icon: faCircleDot,
	filter: issueFilterMyIssuesFunction,
	count: (issues, map, option) =>
		countUnreadIssues(issueFilterMyIssues, issues, map, option),
} as const;
export const issueFilterMyPr: IssueFilter = {
	type: 'my-pr',
	title: 'My PullRequests',
	icon: faCodePullRequest,
	filter: issueFilterMyPrFunction,
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

export interface IssueFilter {
	readonly type: IssueFilterTypes;
	readonly title: string;
	readonly icon: IconDefinition;
	readonly filter: IssueFilterFunction;
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
