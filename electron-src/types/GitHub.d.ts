export interface GithubUserMinimumInfo {
	id: number;
	node_id: string;
	login: string;
	avatar_url: string;
	html_url: string;
}

export interface GithubUserInfo extends GithubUserMinimumInfo {
	name: string | null;
	url: string;
	email: string | null;
	created_at: string;
	updated_at: string;
}

export interface GithubIssue {
	id: number;
	node_id: string;
	url: string;
	title: string;
	html_url: string;
	number: number;
	state: 'open' | 'closed';
	body?: string | null;
	user: GithubUserMinimumInfo | null;
	labels: string[] | GithubLabel[];
	milestone: GithubMilestone | null;
	assignees?: GithubUserMinimumInfo[] | null;
	pull_request?: GithubPullRequest;
	closed_at?: string | null;
	draft?: boolean;
	repository?: GithubRepository;
	comments?: number;
	reactions?: GithubIssueReaction;
	created_at: string;
	updated_at: string;
}

export interface GithubRepository {
	id: number;
	node_id: string;
	full_name: string;
	html_url: string;
}

export interface GithubLabel {
	id: number;
	node_id: string;
	name: string;
	description: string | null;
	color: string | null;
}

export interface GithubMilestone {
	id: number;
	node_id: string;
	number: number;
	html_url: string;
	state: 'open' | 'closed';
	title: string;
	description: string | null;
}

export interface GithubPullRequest {
	merged_at: string | null;
	html_url: string | null;
	diff_url: string | null;
}

export interface GithubIssueReaction {
	url: string;
	total_count: number;
}

export interface GithubPrReview {
	id: number;
	node_id: string;
	user: GithubUserMinimumInfo;
	state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'PENDING';
}

type GithubFullIssueData = {
	issue: GithubIssue;
	reviews: GithubPrReview[];
};
