import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const transitionCss = readFileSync('src/components/ChapterTransition.css', 'utf8');

describe('ChapterTransition stationary walker styles', () => {
  it('uses a fixed rim-lit walker and never translates it across the viewport', () => {
    expect(transitionCss).toContain('right: clamp(1rem, 6vw, 5rem);');
    expect(transitionCss).toContain('filter: grayscale(1) brightness(0.2)');
    expect(transitionCss).not.toContain('-18vw');
    expect(transitionCss).not.toContain('105vw');
    expect(transitionCss).not.toContain('@keyframes chapter-transition-walk');
  });
});
