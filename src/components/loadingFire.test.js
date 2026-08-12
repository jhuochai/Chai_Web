import { describe, expect, it } from 'vitest';
import { createFireParticles, getAutoTarget, getCanvasMetrics } from './loadingFire';

describe('loading fire helpers', () => {
  it('creates every particle at the requested impact point', () => {
    const particles = createFireParticles({ x: 321, y: 222, random: () => 0.5 });

    expect(particles.length).toBeGreaterThan(160);
    expect(particles.every((particle) => particle.x === 321 && particle.y === 222)).toBe(true);
    expect(new Set(particles.map((particle) => particle.kind))).toEqual(
      new Set(['core', 'spark', 'ember', 'arcane'])
    );
    expect(particles.filter((particle) => particle.kind === 'arcane').length).toBeGreaterThan(20);
  });

  it('caps the backing-store density without changing CSS coordinates', () => {
    expect(getCanvasMetrics(910, 698, 3)).toEqual({
      cssWidth: 910,
      cssHeight: 698,
      dpr: 2,
    });
  });

  it('places automatic fire in an unobstructed right-side region', () => {
    expect(getAutoTarget(1000, 800)).toEqual({ x: 780, y: 352 });
  });
});
