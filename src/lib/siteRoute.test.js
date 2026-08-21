import { describe, expect, it, vi } from 'vitest';
import { getRecommendedNext, getStationByRoute, STATIONS } from '../data/stations';
import { getSiteRoute, navigateToRoute } from './siteRoute';

describe('station data', () => {
  it('defines the six real ship stations with their paths and labels', () => {
    expect(STATIONS).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'cockpit', route: '/', zh: '駕駛艙', en: 'Cockpit', next: 'profile' }),
      expect.objectContaining({ id: 'profile', route: '/profile', zh: '艦長辦公室', en: "Captain's Office", next: 'career-tree' }),
      expect.objectContaining({ id: 'career-tree', route: '/career-tree', zh: '航跡樹站', en: 'Route Tree Station', next: 'portfolio' }),
      expect.objectContaining({ id: 'portfolio', route: '/portfolio', zh: '影像分析艙', en: 'Analysis Bay', next: 'cockpit' }),
      expect.objectContaining({ id: 'ai-lab', route: '/ai-lab', zh: 'AI 實驗艙', en: 'AI Lab', next: 'cockpit' }),
      expect.objectContaining({ id: 'making-of', route: '/making-of', zh: '網站製作檔案', en: 'Making-of Archive' }),
    ]));
  });

  it('finds a station by route', () => {
    expect(getStationByRoute('/career-tree')).toMatchObject({ id: 'career-tree' });
    expect(getStationByRoute('/missing')).toBeUndefined();
  });

  it('returns a recommended next station only for the formal route', () => {
    expect(getRecommendedNext('/profile')).toMatchObject({ id: 'career-tree' });
    expect(getRecommendedNext('/making-of')).toBeUndefined();
  });
});

describe('getSiteRoute', () => {
  it.each([
    ['/', 'cockpit'],
    ['/profile', 'profile'],
    ['/career-tree', 'career-tree'],
    ['/portfolio', 'portfolio'],
    ['/ai-lab', 'ai-lab'],
    ['/making-of', 'making-of'],
  ])('maps %s to the %s station', (pathname, station) => {
    expect(getSiteRoute(pathname)).toBe(station);
  });

  it('falls back to the cockpit for unknown paths', () => {
    expect(getSiteRoute('/anything-else')).toBe('cockpit');
  });
});

describe('navigateToRoute', () => {
  it('pushes the pathname and broadcasts a popstate event', () => {
    const onPopState = vi.fn();
    window.addEventListener('popstate', onPopState);

    navigateToRoute('/portfolio');

    expect(window.location.pathname).toBe('/portfolio');
    expect(onPopState).toHaveBeenCalledOnce();
    window.removeEventListener('popstate', onPopState);
  });
});
