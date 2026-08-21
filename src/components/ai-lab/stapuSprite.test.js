import { describe, expect, it } from 'vitest';
import { getStapuFrameStyle } from './stapuSprite';

describe('Stapu sprite atlas', () => {
  it('maps an atlas cell to percentage offsets', () => {
    expect(getStapuFrameStyle({ row: 2, frame: 3 })).toEqual({ '--stapu-x': '-37.5%', '--stapu-y': '-18.1818%' });
    expect(getStapuFrameStyle({ row: 0, frame: 0 })).toEqual({ '--stapu-x': '0%', '--stapu-y': '0%' });
  });

  it('clamps coordinates to the validated 8 by 11 atlas', () => {
    expect(getStapuFrameStyle({ row: 99, frame: 99 })).toEqual({ '--stapu-x': '-87.5%', '--stapu-y': '-90.9091%' });
  });
});
