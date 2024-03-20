import type { IssueFilterFunction } from '../../types/IssueFilter';
import type { Issue } from '../../types/Issue';
import type { UserInfo } from '../../types/User';
import type { IssueFilterTypes } from '../../types/IssueFilter';

export const issueFilterAllFunction: IssueFilterFunction = (_issue, _option) =>
	true;
export const issueFilterOpenFunction: IssueFilterFunction = (issue, _option) =>
	['open', 'draft'].includes(issue.state.state);
export const issueFilterMyIssuesFunction: IssueFilterFunction = (
	issue,
	{ user },
) => issue.state.type === 'issue' && checkOwnIssue(issue, user);
export const issueFilterMyPrFunction: IssueFilterFunction = (issue, { user }) =>
	issue.state.type === 'pull-request' && checkOwnIssue(issue, user);

export const choiceIssueFilterFunction = (
	type: IssueFilterTypes,
): IssueFilterFunction => {
	switch (type) {
		case 'all':
			return issueFilterAllFunction;
		case 'open':
			return issueFilterOpenFunction;
		case 'my-issues':
			return issueFilterMyIssuesFunction;
		case 'my-pr':
			return issueFilterMyPrFunction;
	}

	throw new Error(`Unreachable code choiceIssueFilterFunction: ${type}`);
};

const checkOwnIssue = (issue: Issue, user: UserInfo | null) => {
	if (!issue.creator || !user) {
		return false;
	}
	return issue.creator.login === user.login;
};
