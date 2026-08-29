import { describe, expect, it } from 'vitest';
import {
  DAY_OCCLUSION_PATCHES,
  GAME_BLOOM_LAYOUT,
  NIGHT_OCCLUSION_PATCHES,
  RIBBON_SPOTS,
} from './careerTreeLayout';

describe('career tree scene layout', () => {
  it('keeps all twelve blooms away from the lower main-trunk corridor', () => {
    const blooms = Object.values(GAME_BLOOM_LAYOUT);
    expect(blooms).toHaveLength(12);

    for (const bloom of blooms) {
      const x = Number.parseFloat(bloom.left);
      const y = Number.parseFloat(bloom.top);
      expect(y < 56 || x <= 45 || x >= 56).toBe(true);
    }
  });

  it('hangs four ribbons from named branch anchors', () => {
    expect(Object.keys(RIBBON_SPOTS)).toEqual(['gamesofa', 'ntpu', 'actg', 'eelin']);
    for (const spot of Object.values(RIBBON_SPOTS)) {
      expect(spot.anchor).toMatch(/^(crown|lower)-(left|right)$/);
    }
  });

  it('provides one foreground attachment patch for every decoration', () => {
    expect(DAY_OCCLUSION_PATCHES).toHaveLength(4);
    expect(NIGHT_OCCLUSION_PATCHES).toHaveLength(12);
    expect(DAY_OCCLUSION_PATCHES.map(({ id }) => id).sort()).toEqual(Object.keys(RIBBON_SPOTS).sort());
    expect(NIGHT_OCCLUSION_PATCHES.map(({ id }) => id).sort()).toEqual(Object.keys(GAME_BLOOM_LAYOUT).sort());
  });

  it('keeps every occlusion patch local to an attachment seam', () => {
    for (const patch of DAY_OCCLUSION_PATCHES) {
      expect(patch.rx).toBeGreaterThanOrEqual(18);
      expect(patch.rx).toBeLessThanOrEqual(34);
      expect(patch.ry).toBeGreaterThanOrEqual(7);
      expect(patch.ry).toBeLessThanOrEqual(12);
    }
    for (const patch of NIGHT_OCCLUSION_PATCHES) {
      expect(patch.rx).toBeGreaterThanOrEqual(8);
      expect(patch.rx).toBeLessThanOrEqual(14);
      expect(patch.ry).toBeGreaterThanOrEqual(3);
      expect(patch.ry).toBeLessThanOrEqual(6);
    }
  });
});
