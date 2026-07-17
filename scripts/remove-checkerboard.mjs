import sharp from 'sharp';
import path from 'node:path';

/**
 * The AI-generated sprites in 設計參考/ have a FAKE transparency
 * checkerboard painted into the pixels (plus painted wall shadows and
 * glows on some). This script rebuilds real alpha:
 *
 * - "matte" (characters, gun): flood-fill the checker from the image
 *   borders. Connectivity protects same-colored pixels inside the
 *   subject; a brightness-modulated match (k·checker) also removes
 *   painted soft shadows/glows over the checker while a k floor keeps
 *   dark clothing safe. Enclosed checker holes (trigger guard, between
 *   limbs) are caught by a component pass, stray leftover fragments by
 *   an island cleanup, and the silhouette edge is feathered/defringed.
 * - "glow" (ribbon, flower): the checker never drew perfectly periodic,
 *   so phase-based unmixing moirés. Instead: both checker grays are
 *   achromatic, so alpha comes from the distance to the *achromatic
 *   brightness family* k·C — phase-free. Chromatic glow keeps partial
 *   alpha; pure checker drops out; RGB stays untouched.
 */

const SOURCE_DIR = path.resolve('設計參考');
const OUTPUT_DIR = path.resolve('src/assets/scenes');
const WEBP_QUALITY = 82;

const SPRITES = [
  { file: '拿著槍的手.png', name: 'gun-hand', mode: 'tile', kMin: 0.95, kMax: 1.7, maxEdge: 1400 },
  { file: 'character_hanging upside down.png', name: 'character-hanging', mode: 'matte', distMode: 'parity', kMin: 0.38, kMax: 1.06, maxEdge: 1400 },
  // The walk art is a 2x2 sprite sheet of walking poses; slice it into
  // four animation frames (see slice: below).
  { file: 'character_walk.png', name: 'character-walk', mode: 'matte', distMode: 'parity', kMin: 0.38, kMax: 1.06, maxEdge: 1400, slice: { cols: 2, rows: 2 } },
  // Lower k floor: the painted wall shadow behind her back gets darker
  // than 0.38·checker; her clothing is darker still, so 0.30 stays safe.
  { file: 'character_lean.png', name: 'character-lean', mode: 'matte', distMode: 'parity', kMin: 0.3, kMax: 1.06, maxEdge: 1400 },
  { file: 'character_ribbon.png', name: 'character-ribbon', mode: 'matte', distMode: 'parity', kMin: 0.38, kMax: 1.06, maxEdge: 1400 },
  { file: 'tree_ribbon.png', name: 'tree-ribbon', mode: 'glow', kMin: 0.75, kMax: 1.8, maxEdge: 1400 },
  { file: 'single_flower.png', name: 'single-flower', mode: 'glow', kMin: 0.75, kMax: 1.8, maxEdge: 1400 },
];

const LO = 16; // dist <= LO → definitely checker background
const HI = 64; // dist >= HI → definitely subject
const MIN_ISLAND = 1500; // px; smaller disconnected alpha blobs are leftovers

const px = (data, w, x, y) => {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};
const maxDiff = (a, b) =>
  Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
const luma = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

function detectChecker(data, w, h) {
  const c0 = px(data, w, 1, 1);
  let x1 = -1;
  for (let x = 2; x < Math.min(w, 600); x++) {
    if (maxDiff(px(data, w, x, 1), c0) > 10) {
      x1 = x;
      break;
    }
  }
  if (x1 < 0) throw new Error('no horizontal checker transition found');
  const c1 = px(data, w, x1 + 2, 1);
  let x2 = -1;
  for (let x = x1 + 2; x < Math.min(w, 1200); x++) {
    if (maxDiff(px(data, w, x, 1), c1) > 10) {
      x2 = x;
      break;
    }
  }
  if (x2 < 0) throw new Error('no second checker transition found');
  const T = x2 - x1;
  const ox = ((x1 % T) + T) % T;
  let y1 = -1;
  for (let y = 2; y < Math.min(h, 1200); y++) {
    if (maxDiff(px(data, w, 1, y), c0) > 10) {
      y1 = y;
      break;
    }
  }
  if (y1 < 0) throw new Error('no vertical checker transition found');
  const oy = ((y1 % T) + T) % T;
  return { T, ox, oy, colors: [c0, c1] };
}

/**
 * Distance from a pixel to the brightness-modulated checker color:
 * min over allowed k of maxDiff(p, k·C). Since scaling is monotone,
 * clamping the least-squares k into [kMin, kMax] is exact enough.
 */
function distToFamily(p, C, kMin, kMax) {
  const k = Math.max(kMin, Math.min(kMax, luma(p) / Math.max(1, luma(C))));
  return maxDiff(p, [k * C[0], k * C[1], k * C[2]]);
}

function makeDist(data, w, checker, { distMode, kMin, kMax }) {
  const { T, ox, oy, colors } = checker;
  const cell = (v, o) => Math.floor((v - o + T * 4096) / T);
  return (x, y) => {
    const p = px(data, w, x, y);
    if (distMode === 'family') {
      return Math.min(
        distToFamily(p, colors[0], kMin, kMax),
        distToFamily(p, colors[1], kMin, kMax)
      );
    }
    const inX = (x - ox + T * 4096) % T;
    const inY = (y - oy + T * 4096) % T;
    if (inX <= 2 || inX >= T - 2 || inY <= 2 || inY >= T - 2) {
      return Math.min(
        distToFamily(p, colors[0], kMin, kMax),
        distToFamily(p, colors[1], kMin, kMax)
      );
    }
    const parity = (cell(x, ox) + cell(y, oy)) % 2;
    return distToFamily(p, colors[parity], kMin, kMax);
  };
}

const NEIGHBORS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function matteAlpha(data, w, h, dist, checkerColors) {
  const alpha = new Uint8Array(w * h).fill(255);
  const bg = new Uint8Array(w * h);
  const queue = [];
  const trySeed = (x, y) => {
    const i = y * w + x;
    if (!bg[i] && dist(x, y) <= LO) {
      bg[i] = 1;
      queue.push(i);
    }
  };
  for (let x = 0; x < w; x++) {
    trySeed(x, 0);
    trySeed(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    trySeed(0, y);
    trySeed(w - 1, y);
  }
  while (queue.length) {
    const i = queue.pop();
    const cx = i % w;
    const cy = (i - cx) / w;
    for (const [dx, dy] of NEIGHBORS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (!bg[ni] && dist(nx, ny) <= LO) {
        bg[ni] = 1;
        queue.push(ni);
      }
    }
  }

  // Enclosed checker holes: leftover checker-matching components that
  // span BOTH checker colors must be background even without a border
  // connection — a subject highlight only ever matches one color.
  const seen = new Uint8Array(w * h);
  for (let start = 0; start < w * h; start++) {
    if (bg[start] || seen[start]) continue;
    const sx = start % w;
    const sy = (start - sx) / w;
    if (dist(sx, sy) > LO) continue;
    const members = [start];
    seen[start] = 1;
    let parity0 = 0;
    let parity1 = 0;
    for (let qi = 0; qi < members.length; qi++) {
      const i = members[qi];
      const cx = i % w;
      const cy = (i - cx) / w;
      const p = px(data, w, cx, cy);
      if (maxDiff(p, checkerColors[0]) < maxDiff(p, checkerColors[1])) parity0++;
      else parity1++;
      for (const [dx, dy] of NEIGHBORS) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (bg[ni] || seen[ni]) continue;
        if (dist(nx, ny) <= LO) {
          seen[ni] = 1;
          members.push(ni);
        }
      }
    }
    if (members.length >= 150 && Math.min(parity0, parity1) >= members.length * 0.08) {
      for (const i of members) bg[i] = 1;
    }
  }

  for (let i = 0; i < w * h; i++) if (bg[i]) alpha[i] = 0;

  // Feather the silhouette: subject pixels touching background get
  // partial alpha from their checker distance (kills the 1-2px halo).
  const out = Uint8Array.from(alpha);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (alpha[i] === 0) continue;
      let touchesBg = false;
      for (let dy = -2; dy <= 2 && !touchesBg; dy++) {
        for (let dx = -2; dx <= 2 && !touchesBg; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (alpha[ny * w + nx] === 0) touchesBg = true;
        }
      }
      if (touchesBg) {
        const a = Math.max(0, Math.min(1, (dist(x, y) - LO) / (HI - LO)));
        out[i] = Math.round(a * 255);
      }
    }
  }

  // Island cleanup: drop small disconnected alpha blobs (shadow and
  // checker fragments that survived); keep every substantial component.
  const comp = new Uint8Array(w * h);
  for (let start = 0; start < w * h; start++) {
    if (out[start] === 0 || comp[start]) continue;
    const members = [start];
    comp[start] = 1;
    for (let qi = 0; qi < members.length; qi++) {
      const i = members[qi];
      const cx = i % w;
      const cy = (i - cx) / w;
      for (const [dx, dy] of NEIGHBORS) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (out[ni] !== 0 && !comp[ni]) {
          comp[ni] = 1;
          members.push(ni);
        }
      }
    }
    if (members.length < MIN_ISLAND) {
      for (const i of members) out[i] = 0;
    }
  }
  return out;
}

/**
 * Tile-differential background detection, for sprites where a smooth
 * achromatic glow covers a (slightly drifting) checker AND the subject
 * itself has achromatic patches: a background pixel differs from its
 * same-parity neighbours (±2 tiles) by ~0 and from its cross-parity
 * neighbour (±1 tile) by ~|C1-C0|, regardless of the glow on top.
 * Subject patches aren't tile-periodic, so they fail the test.
 */
function tileAlpha(data, w, h, dist, checker) {
  const { T, colors } = checker;
  const dLuma = Math.abs(luma(colors[1]) - luma(colors[0]));
  const bandLo = dLuma * 0.65;
  const bandHi = dLuma * 1.65;
  const bg = new Uint8Array(w * h);

  const axisPass = (x, y, dx, dy) => {
    const xa = x - dx * T;
    const ya = y - dy * T;
    const xc = x + dx * T;
    const yc = y + dy * T;
    if (xa < 0 || ya < 0 || xc >= w || yc >= h || xa >= w || yc < 0 || ya >= h || xc < 0) {
      return false;
    }
    const A = px(data, w, xa, ya);
    const B = px(data, w, x, y);
    const C = px(data, w, xc, yc);
    if (maxDiff(A, C) > 14) return false;
    const step = Math.abs(luma(B) - luma(A));
    return step >= bandLo && step <= bandHi;
  };

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (axisPass(x, y, 1, 0) || axisPass(x, y, 0, 1)) {
        bg[y * w + x] = 1;
      }
    }
  }

  // The tile test can't fire within ~T of the silhouette (a sample lands
  // inside the subject), leaving a rim of glow-checker. Expand from the
  // confirmed background into family-matching pixels, but depth-limited
  // so it cannot wander deep into achromatic parts of the subject.
  const depth = new Int16Array(w * h).fill(-1);
  const queue = [];
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) {
      depth[i] = 0;
      queue.push(i);
    }
  }
  const MAX_DEPTH = Math.round(T * 1.2);
  for (let qi = 0; qi < queue.length; qi++) {
    const i = queue[qi];
    if (depth[i] >= MAX_DEPTH) continue;
    const cx = i % w;
    const cy = (i - cx) / w;
    for (const [dx, dy] of NEIGHBORS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (bg[ni]) continue;
      if (dist(nx, ny) <= 12) {
        bg[ni] = 1;
        depth[ni] = depth[i] + 1;
        queue.push(ni);
      }
    }
  }

  // Close pinholes: an alpha pixel whose 5x5 neighbourhood is mostly
  // background is tile-test noise, not subject.
  const alpha = new Uint8Array(w * h).fill(255);
  for (let i = 0; i < w * h; i++) if (bg[i]) alpha[i] = 0;
  const closed = Uint8Array.from(alpha);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (alpha[i] === 0) continue;
      let bgCount = 0;
      let total = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          total++;
          if (alpha[ny * w + nx] === 0) bgCount++;
        }
      }
      if (bgCount >= total * 0.72) closed[i] = 0;
    }
  }

  // Reuse the island cleanup from matte: drop small leftovers.
  const comp = new Uint8Array(w * h);
  for (let start = 0; start < w * h; start++) {
    if (closed[start] === 0 || comp[start]) continue;
    const members = [start];
    comp[start] = 1;
    for (let qi = 0; qi < members.length; qi++) {
      const i = members[qi];
      const cx = i % w;
      const cy = (i - cx) / w;
      for (const [dx, dy] of NEIGHBORS) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (closed[ni] !== 0 && !comp[ni]) {
          comp[ni] = 1;
          members.push(ni);
        }
      }
    }
    if (members.length < MIN_ISLAND) {
      for (const i of members) closed[i] = 0;
    }
  }
  return closed;
}

function glowAlpha(data, w, h, dist) {
  const alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = dist(x, y);
      let a = (d - 8) / (HI - 8);
      a = Math.max(0, Math.min(1, a));
      if (a < 0.05) a = 0;
      alpha[y * w + x] = Math.round(a * 255);
    }
  }
  return alpha;
}

async function processSprite(sprite) {
  const { file, name, mode, maxEdge } = sprite;
  const inputPath = path.join(SOURCE_DIR, file);
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const checker = detectChecker(data, w, h);
  const dist = makeDist(data, w, checker, {
    distMode: sprite.distMode ?? 'family',
    kMin: sprite.kMin,
    kMax: sprite.kMax,
  });
  const alpha =
    mode === 'matte'
      ? matteAlpha(data, w, h, dist, checker.colors)
      : mode === 'tile'
        ? tileAlpha(data, w, h, dist, checker)
        : glowAlpha(data, w, h, dist);

  const out = Buffer.alloc(w * h * 4);
  let transparent = 0;
  for (let i = 0; i < w * h; i++) {
    const a = alpha[i];
    if (a === 0) {
      transparent++;
      continue;
    }
    const s = i * 4;
    out[s] = data[s];
    out[s + 1] = data[s + 1];
    out[s + 2] = data[s + 2];
    out[s + 3] = a;
  }

  const makeResized = (img, iw, ih) => {
    const isWide = iw >= ih;
    return Math.max(iw, ih) > maxEdge
      ? img.resize(isWide ? maxEdge : null, isWide ? null : maxEdge, {
          fit: 'inside',
          withoutEnlargement: true,
        })
      : img;
  };

  if (sprite.slice) {
    const { cols, rows } = sprite.slice;
    const fw = Math.floor(w / cols);
    const fh = Math.floor(h / rows);
    let frame = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const img = sharp(out, { raw: { width: w, height: h, channels: 4 } }).extract({
          left: c * fw,
          top: r * fh,
          width: fw,
          height: fh,
        });
        const outputPath = path.join(OUTPUT_DIR, `${name}-${frame}.webp`);
        await makeResized(img, fw, fh).webp({ quality: WEBP_QUALITY }).toFile(outputPath);
        frame++;
      }
    }
  } else {
    const image = sharp(out, { raw: { width: w, height: h, channels: 4 } });
    const outputPath = path.join(OUTPUT_DIR, `${name}.webp`);
    await makeResized(image, w, h).webp({ quality: WEBP_QUALITY }).toFile(outputPath);
  }
  console.log(
    `${name}: T=${checker.T} colors=[${checker.colors.map((c) => c.join(',')).join('][')}] ` +
      `transparent=${((100 * transparent) / (w * h)).toFixed(1)}%${sprite.slice ? ' (sliced)' : ''}`
  );
}

async function main() {
  for (const sprite of SPRITES) {
    await processSprite(sprite);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
