export const CHAPTER_TRANSITION_EVENT = 'chapter-transition:start';

const SAFE_CHAPTER_SELECTOR = /^#scene-\d+$/;

export function isSafeChapterSelector(targetSelector) {
  return typeof targetSelector === 'string' && SAFE_CHAPTER_SELECTOR.test(targetSelector);
}

export function playChapterTransition(targetSelector) {
  if (!isSafeChapterSelector(targetSelector) || typeof window === 'undefined') return false;
  window.dispatchEvent(new CustomEvent(CHAPTER_TRANSITION_EVENT, { detail: targetSelector }));
  return true;
}
