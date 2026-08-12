export const chapterMap = [
  { id: 'intro', target: '#scene-2' },
  { id: 'career', target: '#scene-3' },
  { id: 'portfolio', target: '#scene-5' },
  { id: 'contact', target: '#scene-7' },
];

export function getNextChapter(id) {
  const index = chapterMap.findIndex((chapter) => chapter.id === id);
  return chapterMap[(index + 1) % chapterMap.length];
}
