import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  isSafeStationPathname,
  playStationTransition,
  STATION_TRANSITION_EVENT,
} from './chapterTransition';

describe('station transition requests', () => {
  afterEach(() => vi.restoreAllMocks());

  it.each(['/', '/profile', '/career-tree', '/portfolio', '/ai-lab'])('accepts the formal station pathname %s', (pathname) => {
    expect(isSafeStationPathname(pathname)).toBe(true);
  });

  it.each(['#scene-3', '/making-of', 'https://example.com', '//example.com', '/profile?next=/portfolio', '/unknown', '', null])(
    'rejects an unsafe station pathname %s',
    (pathname) => {
      expect(isSafeStationPathname(pathname)).toBe(false);
    }
  );

  it('dispatches one formal pathname and refuses unsafe requests', () => {
    const listener = vi.fn();
    window.addEventListener(STATION_TRANSITION_EVENT, listener);

    expect(playStationTransition('/portfolio')).toBe(true);
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail).toBe('/portfolio');
    expect(playStationTransition('#scene-5')).toBe(false);
    expect(listener).toHaveBeenCalledOnce();

    window.removeEventListener(STATION_TRANSITION_EVENT, listener);
  });
});
