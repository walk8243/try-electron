import Store from 'electron-store'

export const store = new Store<{ githubHostname: string, githubToken: string }>({ schema: {
	githubHostname: {
		type: 'string'
	},
	githubToken: {
		type: 'string'
	}
} })
