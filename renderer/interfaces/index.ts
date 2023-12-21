import type { UserInfo } from '../../types/User';
import type { Issue } from '../../types/Issue';

declare global {
	interface Window {
		electron: {
			issue: (url: string) => Promise<void>;
			open: (url: string) => void;
			ready: () => void;
			pushUser: (callback: (user: UserInfo) => void) => void;
			pushIssues: (callback: (issues: Issue[]) => void) => void;
			pushUpdatedAt: (callback: (updatedAt: string) => void) => void;
		};
		setting: {
			display: () => Promise<SettingData>;
			submit: (data: SettingData) => void;
			cancel: () => void;
		};
		about: {
			version: () => Promise<string>;
			close: () => void;
			open: (url: string) => void;
		};
	}
}

export type SettingData = { baseUrl: string; token?: string };
