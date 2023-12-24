import { Dispatch, createContext } from 'react';
import { Issue } from '../../types/Issue';

export const IssueContext = createContext<Issue | null>(null);
export const IssueDispatchContext = createContext<Dispatch<Issue>>((_v) => {});
