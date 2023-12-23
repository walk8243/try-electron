import Store from 'electron-store';
import type { UserInfo } from '../../types/User';
import type { Issue } from '../../types/Issue';

export const store = new Store<{
	githubSetting: { baseUrl: string; token: string };
	userInfo: UserInfo;
	issueData: {
		updatedAt: string;
		issues: Issue[];
	};
}>({
	schema: {
		githubSetting: {
			type: 'object',
			properties: {
				baseUrl: {
					type: 'string',
				},
				token: {
					type: 'string',
				},
			},
		},
		userInfo: {
			type: 'object',
			properties: {
				login: {
					type: 'string',
				},
				name: {
					type: 'string',
				},
				avatarUrl: {
					type: 'string',
				},
			},
		},
		issueData: {
			type: 'object',
			properties: {
				updatedAt: {
					type: 'string',
				},
				issues: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							id: {
								type: 'number',
							},
							key: {
								type: 'string',
							},
							title: {
								type: 'string',
							},
							url: {
								type: 'string',
							},
							repositoryName: {
								type: 'string',
							},
							state: {
								type: 'object',
								properties: {
									type: {
										type: 'string',
									},
									state: {
										type: 'string',
									},
								},
							},
							labels: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										key: {
											type: 'string',
										},
										text: {
											type: 'string',
										},
										color: {
											type: 'string',
										},
									},
								},
							},
							reactions: {
								type: 'number',
							},
							user: {
								type: 'string',
							},
							updated_at: {
								type: 'string',
							},
						},
					},
				},
			},
		},
	},
});

store.clear();
