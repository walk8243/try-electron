import Store from 'electron-store'

export const store = new Store<{ githubToken: string }>({ schema: {
	githubToken: {
		type: 'string'
	}
} })
