import Store from 'electron-store'

export const store = new Store<{ githubBaseUrl: string, githubToken: string }>({ schema: {
	githubBaseUrl: {
		type: 'string',
		default: 'https://api.github.com/'
	},
	githubToken: {
		type: 'string'
	}
} })
