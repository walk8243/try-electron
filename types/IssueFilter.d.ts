export type IssueFilterTypes = 'all' | 'open' | 'my-issues' | 'my-pr';
export type IssueFilterFunction = (
	issue: Issue,
	option: IssueFilterOption,
) => boolean;
export type IssueFilterOption = { user: UserInfo | null };
