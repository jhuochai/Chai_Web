import { describe, expect, it, vi } from 'vitest';
import { getDestinationAction, getInitialHeroApproach, rememberHeroApproach } from './heroState';

describe('hero state', () => {
  it('starts far once, then starts near for the session', () => {
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn() };
    expect(getInitialHeroApproach({ reduce: false, storage })).toBe(0);
    rememberHeroApproach(storage);
    expect(storage.setItem).toHaveBeenCalledWith('hero-approached', '1');
    storage.getItem.mockReturnValue('1');
    expect(getInitialHeroApproach({ reduce: false, storage })).toBe(1);
    expect(getInitialHeroApproach({ reduce: true, storage })).toBe(1);
  });

  it('maps each control to one exclusive action', () => {
    expect(getDestinationAction('intro')).toEqual({ kind: 'travel', target: '/profile', motion: 'turn' });
    expect(getDestinationAction('career')).toEqual({ kind: 'travel', target: '/career-tree', motion: 'push' });
    expect(getDestinationAction('portfolio')).toEqual({ kind: 'travel', target: '/portfolio', motion: 'pull' });
    expect(getDestinationAction('ai-lab')).toEqual({ kind: 'preview', target: '/ai-lab', motion: 'boot' });
  });
});
