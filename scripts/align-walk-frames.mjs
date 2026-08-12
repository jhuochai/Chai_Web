import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sceneDir = path.resolve('src/assets/scenes');
const canvas = { width: 820, height: 1120 };
const visibleHeight = 980;
const footLine = 1090;

for (let index = 0; index < 4; index += 1) {
  const input = path.join(sceneDir, `character-walk-${index}.webp`);
  const output = path.join(sceneDir, `character-walk-aligned-${index}.webp`);
  const trimmed = await sharp(input).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const resized = await sharp(trimmed)
    .resize({ height: visibleHeight, fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
  const metadata = await sharp(resized).metadata();
  const left = Math.round((canvas.width - metadata.width) / 2);
  const top = footLine - metadata.height;

  await sharp({
    create: {
      width: canvas.width,
      height: canvas.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, left, top }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(output);

  const stats = await fs.stat(output);
  console.log(`${path.basename(output)} ${canvas.width}x${canvas.height} ${stats.size} bytes`);
}
