import { createContext } from 'react';
import type { IssueSupplementMap } from '../../types/Issue';

export const IssueSupplementMapContext = createContext<IssueSupplementMap>({});
