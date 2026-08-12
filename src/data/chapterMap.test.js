import { describe, expect, it } from 'vitest';
import { chapterMap, getNextChapter } from './chapterMap';

describe('chapterMap', () => {
  it('cycles from each chapter to the next configured chapter', () => {
    expect(getNextChapter('intro')).toEqual(chapterMap[1]);
    expect(getNextChapter('contact')).toEqual(chapterMap[0]);
  });

  it('keeps every middle chapter transition in sequence', () => {
    expect(getNextChapter('intro').id).toBe('career');
    expect(getNextChapter('career').id).toBe('portfolio');
    expect(getNextChapter('portfolio').id).toBe('contact');
    expect(getNextChapter('contact').id).toBe('intro');
  });
});
