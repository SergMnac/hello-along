import type { AnalyticsEvent } from './types';

const STORAGE_KEY = 'along-21dtl-visited';

export const emitAnalytics = (name: AnalyticsEvent['name'], detail?: AnalyticsEvent['detail']) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('along:analytics', { detail: { name, detail } }));
};

export const markRepeatVisit = () => {
  if (typeof window === 'undefined') return false;
  try {
    const hasVisited = window.localStorage.getItem(STORAGE_KEY) === '1';
    window.localStorage.setItem(STORAGE_KEY, '1');
    return hasVisited;
  } catch {
    return false;
  }
};
