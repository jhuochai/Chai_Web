let lockCount = 0;
let initialOverflow = '';

export function acquireBodyScrollLock() {
  if (lockCount === 0) {
    initialOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
  let released = false;

  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.body.style.overflow = initialOverflow;
      initialOverflow = '';
    }
  };
}
