export interface GithubUserMinimumInfo {
	id: number,
	login: string,
	avatar_url: string,
	html_url: string,
}

export interface GithubUserInfo extends GithubUserMinimumInfo {
	name: string | null,
	url: string,
	email: string | null,
	blog: string
}

export interface GithubIssue {
	id: number,
	node_id: string,
	title: string,
	html_url: string,
	state: string,
	body: string | null,
	user: GithubUserMinimumInfo | null,
	labels: string[] | GithubLabel[],
	milestone: GithubMilestone | null,
	assignees: GithubUserMinimumInfo[] | null,
	repository: GithubRepository,
	comments: number,
	updated_at: string,
}

export interface GithubRepository {
	id: number,
	node_id: string,
	full_name: string,
	html_url: string,
}

export interface GithubLabel {
	id: number,
	node_id: string,
	name: string,
	description: string,
	color: string,
}

export interface GithubMilestone {
	id: number,
	node_id: string,
	number: number,
	html_url: string,
	state: string,
	title: string,
	description: string | null,
}
