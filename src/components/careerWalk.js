const DEFAULT_FRAME_COUNT = 4;
const DEFAULT_CYCLES = 10;

export function getWalkFrame(
  scrollProgress,
  frameCount = DEFAULT_FRAME_COUNT,
  cycles = DEFAULT_CYCLES
) {
  const clamped = Math.min(Math.max(scrollProgress, 0), 1);
  if (clamped === 1) return frameCount - 1;
  return Math.floor(clamped * cycles * frameCount) % frameCount;
}
