import { useEffect, useReducer, useState, Reducer, ReactNode } from 'react';
import Head from 'next/head';
import type { UserInfo } from '../../types/User';

import { Box, Grid } from '@mui/material';
import { UserInfoContext } from '../context/UserContext';
import {
	IssueFilterContext,
	IssueFilterDispatchContext,
	issueFilterAll,
	IssueFilter,
} from '../context/IssueFilterContext';
import { Heading } from '../components/Heading';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import IssueList from '../components/IssueList';
import Issue from '../components/Issue';

const IndexPage = () => {
	useEffect(() => {
		window.electron?.ready();
	}, []);

	return (
		<>
			<Head>
				<title>Amethyst</title>
			</Head>
			<IssueFilterContextProvider>
				<UserInfoContextProvider>
					<MainComponent />
				</UserInfoContextProvider>
			</IssueFilterContextProvider>
		</>
	);
};

const MainComponent = () => {
	const [issueUrl, setIssueUrl] = useState('');

	return (
		<Box height="100vh">
			<Header />
			<Grid
				container
				component="main"
				display="grid"
				gridTemplateColumns="250px 350px 1fr"
				gridTemplateRows="1fr"
				height="100%"
				overflow="hidden"
			>
				<Heading level={2} hidden={true}>
					メイン
				</Heading>
				<Grid item sx={{ width: 250 }}>
					<Menu />
				</Grid>
				<Grid item sx={{ width: 350, height: '100%', overflowY: 'hidden' }}>
					<IssueList issueUrlHandler={setIssueUrl} />
				</Grid>
				<Grid item>
					<Issue url={issueUrl} />
				</Grid>
			</Grid>
			<Footer />
		</Box>
	);
};

const UserInfoContextProvider = ({ children }: { children: ReactNode }) => {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	useEffect(() => {
		window.electron?.pushUser((user) => setUserInfo(() => user));
	}, []);

	return (
		<UserInfoContext.Provider value={userInfo}>
			{children}
		</UserInfoContext.Provider>
	);
};

const IssueFilterContextProvider = ({ children }: { children: ReactNode }) => {
	const [issueFilter, dispatch] = useReducer<Reducer<IssueFilter, IssueFilter>>(
		(_prevFilter, currentfilter) => currentfilter,
		issueFilterAll,
	);

	return (
		<IssueFilterContext.Provider value={issueFilter}>
			<IssueFilterDispatchContext.Provider value={dispatch}>
				{children}
			</IssueFilterDispatchContext.Provider>
		</IssueFilterContext.Provider>
	);
};

export default IndexPage;
