import { describe, expect, it } from 'vitest';
import { getSiteRoute } from './siteRoute';

describe('getSiteRoute', () => {
  it('maps only /making-of away from the home route', () => {
    expect(getSiteRoute('/making-of')).toBe('making-of');
    expect(getSiteRoute('/anything-else')).toBe('home');
  });
});
