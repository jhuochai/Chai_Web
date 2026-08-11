let scrollEngine = null;

export function setScrollEngine(engine) {
  scrollEngine = engine;
}

export function scrollToScene(target, { immediate = false } = {}) {
  if (scrollEngine) {
    scrollEngine.scrollTo(target, {
      immediate,
      duration: immediate ? 0 : 1.05,
    });
    return;
  }

  document.querySelector(target)?.scrollIntoView({
    behavior: immediate ? 'auto' : 'smooth',
  });
}
