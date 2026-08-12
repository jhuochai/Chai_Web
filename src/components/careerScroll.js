export function createCareerScrollTrigger(stage, onUpdate) {
  return {
    trigger: stage,
    pin: stage,
    start: 'top top',
    end: '+=140%',
    scrub: 0.7,
    invalidateOnRefresh: true,
    onUpdate,
  };
}
