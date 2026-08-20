import type { NavRoute } from '../types';

export const NAV_ROUTES: NavRoute[] = [
  {
    path: '/',
    label: 'Home',
    shortLabel: 'Home',
    caseNumber: '01',
  },
  {
    path: '/concepts',
    label: 'Concepts',
    shortLabel: 'Concepts',
    caseNumber: '02',
  },
  {
    path: '/prices',
    label: 'Live Prices',
    shortLabel: 'Prices',
    caseNumber: '03',
  },
  {
    path: '/simulator',
    label: 'Block Simulator',
    shortLabel: 'Simulator',
    caseNumber: '04',
  },
];
