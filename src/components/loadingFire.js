export const FIRE_PALETTE = {
  core: ['#fff9e8', '#ffe1a3'],
  spark: ['#ffc56b', '#ff8b42', '#e0bc6a'],
  ember: ['#ff6b32', '#c94f37'],
  arcane: ['#59d6df', '#8c7de8'],
};

export function getCanvasMetrics(width, height, requestedDpr = 1) {
  return {
    cssWidth: width,
    cssHeight: height,
    dpr: Math.min(Math.max(requestedDpr, 1), 2),
  };
}

export function getAutoTarget(width, height) {
  return {
    x: Math.round(width * 0.68),
    y: Math.round(height * 0.42),
  };
}

function createLayer({ kind, count, speedMin, speedMax, x, y, random }) {
  const colors = FIRE_PALETTE[kind];

  return Array.from({ length: count }, (_, index) => {
    const angle = random() * Math.PI * 2;
    const speed = speedMin + random() * (speedMax - speedMin);

    return {
      kind,
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.012 + random() * 0.022,
      size: kind === 'core' ? 5 + random() * 7 : 1.8 + random() * 4.5,
      color: colors[index % colors.length],
    };
  });
}

export function createFireParticles({ x, y, random = Math.random }) {
  const shared = { x, y, random };

  return [
    ...createLayer({ ...shared, kind: 'core', count: 10, speedMin: 0.4, speedMax: 2.2 }),
    ...createLayer({ ...shared, kind: 'spark', count: 52, speedMin: 4.5, speedMax: 12 }),
    ...createLayer({ ...shared, kind: 'ember', count: 34, speedMin: 2, speedMax: 7 }),
    ...createLayer({ ...shared, kind: 'arcane', count: 12, speedMin: 2.5, speedMax: 8 }),
  ];
}
