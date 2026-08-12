import { describe, expect, it } from 'vitest';
import { chapterMap, getNextChapter } from './chapterMap';

describe('chapterMap', () => {
  it('cycles from each chapter to the next configured chapter', () => {
    expect(getNextChapter('intro')).toEqual(chapterMap[1]);
    expect(getNextChapter('contact')).toEqual(chapterMap[0]);
  });
});
