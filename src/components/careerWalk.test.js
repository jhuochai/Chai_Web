import { describe, expect, it } from 'vitest';
import { getWalkFrame } from './careerWalk';

describe('career walk frame', () => {
  it('keeps the same pose while scroll progress is unchanged', () => {
    expect(getWalkFrame(0.42)).toBe(getWalkFrame(0.42));
  });

  it('advances the flipbook from scroll distance rather than elapsed time', () => {
    expect(getWalkFrame(0)).toBe(0);
    expect(getWalkFrame(0.03)).toBe(1);
    expect(getWalkFrame(0.06)).toBe(2);
  });

  it('clamps overscroll without returning an invalid frame', () => {
    expect(getWalkFrame(-1)).toBe(0);
    expect(getWalkFrame(2)).toBe(3);
  });
});
