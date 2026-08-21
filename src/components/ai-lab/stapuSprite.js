const clamp = (value, max) => Math.max(0, Math.min(max, Number(value) || 0));
const percent = (value) => {
  if (value === 0) return '0%';
  return `${Number(value.toFixed(4))}%`;
};

export function getStapuFrameStyle({ row, frame }) {
  const safeFrame = clamp(frame, 7);
  const safeRow = clamp(row, 10);
  return {
    '--stapu-x': percent(-safeFrame * 12.5),
    '--stapu-y': percent(-safeRow * (100 / 11)),
  };
}

export const STAPU_STATES = {
  idle: { row: 0, frames: 6 },
  'running-right': { row: 1, frames: 8 },
  'running-left': { row: 2, frames: 8 },
  waving: { row: 3, frames: 4 },
};
