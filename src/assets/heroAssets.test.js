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
});
