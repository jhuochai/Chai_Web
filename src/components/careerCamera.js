const INTERACTIVE_PROGRESS = 0.75;
const clamp = (value) => Math.min(1, Math.max(0, value));

/**
 * A small input controller for the route tree.  It deliberately owns no
 * animation or scrolling timeline: the scene decides how a progress value is
 * rendered, while this module only translates local input into 0..1.
 */
export function createCareerCameraController({ stage, onProgress = () => {}, reduceMotion = false, initialProgress }) {
  if (!stage) throw new Error('A route-tree stage is required.');

  let progress = clamp(initialProgress ?? (reduceMotion ? 1 : 0));
  let pointer = null;

  const publish = () => onProgress(progress);
  const setProgress = (next) => {
    const clamped = clamp(next);
    if (clamped === progress) return false;
    progress = clamped;
    publish();
    return true;
  };

  const change = (amount) => setProgress(progress + amount);
  const onWheel = (event) => {
    if (!event.deltaY) return;
    change(-event.deltaY / 850);
    event.preventDefault();
  };
  const releasePointer = (pointerId) => {
    if (pointerId == null || !stage.hasPointerCapture?.(pointerId)) return;
    try { stage.releasePointerCapture?.(pointerId); } catch { /* already released by the browser */ }
  };
  const resetPointer = ({ release = true } = {}) => {
    const current = pointer;
    pointer = null;
    if (release) releasePointer(current?.id);
  };
  const onPointerDown = (event) => {
    if (event.button != null && event.button !== 0) return;
    resetPointer();
    pointer = { id: event.pointerId, startY: event.clientY, lastY: event.clientY, consumed: false };
    try { stage.setPointerCapture?.(event.pointerId); } catch { /* window-level input still works */ }
  };
  const onPointerMove = (event) => {
    if (!pointer || (event.pointerId != null && event.pointerId !== pointer.id)) return;
    const total = pointer.startY - event.clientY;
    if (!pointer.consumed && Math.abs(total) < 18) return;
    pointer.consumed = true;
    const delta = pointer.lastY - event.clientY;
    pointer.lastY = event.clientY;
    if (!delta) return;
    change(delta / 180);
    event.preventDefault();
  };
  const onKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      if (change(0.16)) event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      if (change(-0.16)) event.preventDefault();
    }
  };
  const onPointerUp = (event) => {
    if (!pointer || (event.pointerId != null && event.pointerId !== pointer.id)) return;
    resetPointer();
  };
  const onPointerCancel = (event) => {
    if (!pointer || (event.pointerId != null && event.pointerId !== pointer.id)) return;
    resetPointer();
  };
  const onWindowBlur = () => resetPointer();

  stage.addEventListener('wheel', onWheel, { passive: false });
  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove, { passive: false });
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerCancel);
  stage.addEventListener('lostpointercapture', onPointerCancel);
  stage.addEventListener('keydown', onKeyDown);
  window.addEventListener('blur', onWindowBlur);
  publish();

  return {
    getProgress: () => progress,
    setProgress,
    approach: () => change(0.16),
    retreat: () => change(-0.16),
    isInteractive: () => progress >= INTERACTIVE_PROGRESS,
    destroy() {
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', onPointerUp);
      stage.removeEventListener('pointercancel', onPointerCancel);
      stage.removeEventListener('lostpointercapture', onPointerCancel);
      stage.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('blur', onWindowBlur);
      resetPointer();
    },
  };
}

export { INTERACTIVE_PROGRESS };
