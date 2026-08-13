export const STATION_TRANSITION_EVENT = 'station-transition:start';

const SAFE_STATION_PATHNAMES = new Set(['/', '/profile', '/career-tree', '/portfolio']);

export function isSafeStationPathname(pathname) {
  return typeof pathname === 'string' && SAFE_STATION_PATHNAMES.has(pathname);
}

export function playStationTransition(pathname) {
  if (!isSafeStationPathname(pathname) || typeof window === 'undefined') return false;
  window.dispatchEvent(new CustomEvent(STATION_TRANSITION_EVENT, { detail: pathname }));
  return true;
}

// Retained briefly for the next station-content task, where old scene links are replaced.
export const CHAPTER_TRANSITION_EVENT = STATION_TRANSITION_EVENT;
export const isSafeChapterSelector = () => false;
export const playChapterTransition = () => false;
