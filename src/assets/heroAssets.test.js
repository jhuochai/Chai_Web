import { describe, expect, it } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const root = join(process.cwd(), 'src', 'assets');
const props = [
  'hero-handle.webp',
  'hero-joystick.webp',
  'hero-knob.webp',
  'hero-ai-core.webp',
  'hero-trash.webp',
];

describe('Hero and Stapu asset contract', () => {
  it('ships the cockpit, transparent controls, and validated Stapu sheet', async () => {
    await access(join(root, 'scenes', 'hero-cockpit-space.webp'));
    await access(join(root, 'pets', 'stapu-spritesheet.webp'));

    for (const name of props) {
      const metadata = await sharp(await readFile(join(root, 'props', name))).metadata();
      expect(metadata.hasAlpha).toBe(true);
      expect(metadata.width).toBeGreaterThanOrEqual(700);
    }

    const pet = await sharp(
      await readFile(join(root, 'pets', 'stapu-spritesheet.webp')),
    ).metadata();
    expect([pet.width, pet.height]).toEqual([1536, 2288]);
  });

  it('keeps the articulated joystick halves complementary instead of CSS-clipping one bitmap twice', async () => {
    const sourcePath = join(root, 'props', 'hero-joystick-panel-v2.webp');
    const basePath = join(root, 'props', 'hero-joystick-base-v3.webp');
    const gripPath = join(root, 'props', 'hero-joystick-grip-v3.webp');
    const source = await sharp(await readFile(sourcePath)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const base = await sharp(await readFile(basePath)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const grip = await sharp(await readFile(gripPath)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    expect(base.info.width).toBe(source.info.width);
    expect(base.info.height).toBe(source.info.height);
    expect(grip.info.width).toBe(source.info.width);
    expect(grip.info.height).toBe(source.info.height);

    const splitY = Math.round(source.info.height * 0.71);
    let unionMismatches = 0;
    let baseLeaks = 0;
    let gripLeaks = 0;
    for (let y = 0; y < source.info.height; y += 1) {
      for (let x = 0; x < source.info.width; x += 1) {
        const offset = (y * source.info.width + x) * source.info.channels + 3;
        const sourceAlpha = source.data[offset];
        const baseAlpha = base.data[offset];
        const gripAlpha = grip.data[offset];
        if (Math.max(baseAlpha, gripAlpha) !== sourceAlpha) unionMismatches += 1;
        if (y < splitY && baseAlpha !== 0) baseLeaks += 1;
        if (y >= splitY && gripAlpha !== 0) gripLeaks += 1;
      }
    }

    expect(unionMismatches).toBe(0);
    expect(baseLeaks).toBe(0);
    expect(gripLeaks).toBe(0);
  });
});
