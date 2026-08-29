import { describe, expect, it } from 'vitest';
import { CAREER_RIBBON_VISUALS, GAME_BLOOM_VISUALS, getCareerVisual } from './careerVisuals';

describe('career visual manifest', () => {
  it('maps every career ribbon to its own transparent asset and color identity', () => {
    expect(Object.keys(CAREER_RIBBON_VISUALS)).toEqual(['gamesofa', 'ntpu', 'actg', 'eelin']);
    expect(new Set(Object.values(CAREER_RIBBON_VISUALS).map(({ asset }) => asset)).size).toBe(4);
    for (const visual of Object.values(CAREER_RIBBON_VISUALS)) {
      expect(visual).toEqual(expect.objectContaining({
        asset: expect.stringMatching(/\.webp$/),
        accent: expect.stringMatching(/^#/),
        glow: expect.stringMatching(/^rgba\(/),
      }));
    }
  });

  it('maps all seven games to distinct approved bloom assets', () => {
    expect(Object.keys(GAME_BLOOM_VISUALS)).toHaveLength(7);
    expect(new Set(Object.values(GAME_BLOOM_VISUALS).map(({ asset }) => asset)).size).toBe(7);
    expect(getCareerVisual('game', 'minecraft').accent).toBe('#6d9f4d');
    expect(getCareerVisual('game', 'ready-or-not').accent).toBe('#d94141');
  });

  it('fails loudly when content is missing a visual mapping', () => {
    expect(() => getCareerVisual('game', 'missing')).toThrow(/missing visual/i);
  });
});
