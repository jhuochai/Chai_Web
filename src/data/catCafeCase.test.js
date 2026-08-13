import { describe, expect, it } from 'vitest';
import { catCafeCase } from './catCafeCase';

describe('catCafeCase', () => {
  it('contains one hero, five reliable metrics, and eight unique evidence assets', () => {
    for (const lang of ['zh', 'en']) {
      const work = catCafeCase[lang];
      const evidence = work.pillars.flatMap((pillar) => pillar.items);

      expect(work.metrics).toHaveLength(5);
      expect(work.pillars).toHaveLength(4);
      expect(evidence).toHaveLength(8);
      expect(new Set([work.hero.src, ...evidence.map((item) => item.src)]).size).toBe(9);
    }
  });

  it('keeps the approved evidence mapping and treats UFO Day as static work', () => {
    const zh = catCafeCase.zh;

    expect(zh.pillars.map((pillar) => pillar.id)).toEqual([
      'character-needs',
      'resonance',
      'festivals',
      'brand-info',
    ]);
    expect(zh.pillars.flatMap((pillar) => pillar.items.map((item) => item.id))).toEqual([
      'watermelon-cat',
      'outfit-guide',
      'meal-spinner',
      'ufo-day',
      'mother-day',
      'ocean-day',
      'donation',
      'version-120',
    ]);
    expect(zh.pillars.flatMap((pillar) => pillar.items).find((item) => item.id === 'ufo-day').format).toBe('static');
    expect(zh.pillars.flatMap((pillar) => pillar.items).find((item) => item.id === 'donation').alt).toContain('收據');
  });

  it('uses only the reliable hero metrics and the approved growth claim', () => {
    const values = catCafeCase.zh.metrics.map((metric) => metric.value);

    expect(values).toEqual(['51,173', '3,898', '1,476', '383', '50']);
    expect(catCafeCase.zh.growth).toContain('18k → 30k');
    expect(catCafeCase.zh.growth).toContain('+67%');
    expect(catCafeCase.zh.hero.note).toContain('三萬粉－2');
    expect(catCafeCase.zh.hero.note).toContain('第一篇');
    expect(catCafeCase.zh.darkChess.signal).not.toContain('預設');
    expect(JSON.stringify(catCafeCase)).not.toMatch(/互動率|engagement rate/i);
  });
});
