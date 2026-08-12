import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const transitionCss = readFileSync('src/components/ChapterTransition.css', 'utf8');

describe('ChapterTransition responsive styles', () => {
  it('keeps the desktop start at -18vw but starts beyond the full walker width on mobile', () => {
    expect(transitionCss).toContain('--walk-start: -18vw;');
    expect(transitionCss).toMatch(
      /@media \(max-width: 600px\)[\s\S]*--walk-start: calc\(-100% - 16px\);/
    );
    expect(transitionCss).toMatch(
      /@keyframes chapter-transition-walk[\s\S]*from\s*{\s*transform: translateX\(var\(--walk-start\)\);/
    );
  });
});
