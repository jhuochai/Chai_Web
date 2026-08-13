import { describe, expect, it } from 'vitest';
import { portfolioCases } from './portfolioCases';

describe('portfolioCases', () => {
  it('contains only Cat Café and the real data-only Dark Chess case', () => {
    for (const lang of ['zh', 'en']) {
      expect(portfolioCases[lang].cases.map((item) => item.id)).toEqual(['cat-cafe', 'dark-chess']);
      expect(portfolioCases[lang].cases.find((item) => item.id === 'dark-chess').items.every((item) => item.type === 'data')).toBe(true);
    }
  });

  it('keeps verified hero metrics and the inconsistent-rate caveat without inventing new metrics', () => {
    const serialized = JSON.stringify(portfolioCases.zh);
    expect(serialized).toContain('51,173');
    expect(serialized).toContain('3,898');
    expect(serialized).toContain('互動率');
    expect(serialized).toContain('分母');
    expect(serialized).toContain('4 張');
    expect(serialized).toContain('.mp4');
    expect(serialized).not.toMatch(/ROG Phone 9/i);
  });

  it('uses only supported item types and bullet-ready evidence arrays', () => {
    for (const lang of ['zh', 'en']) {
      for (const caseData of portfolioCases[lang].cases) {
        for (const item of caseData.items) {
          expect(['image', 'video', 'data']).toContain(item.type);
          expect(Array.isArray(item.proof)).toBe(true);
          expect(item.proof.length).toBeGreaterThan(0);
          if (item.type === 'video') expect(item.src).toMatch(/\.mp4$/);
          if (item.type === 'data') expect(item.src).toBeUndefined();
        }
      }
    }
  });
});
