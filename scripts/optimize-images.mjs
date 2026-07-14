import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SOURCE_DIR = path.resolve('設計參考');
const OUTPUT_DIR = path.resolve('src/assets/scenes');
const BACKGROUND_MAX_EDGE = 2400;
const SPRITE_MAX_EDGE = 1400;
const WEBP_QUALITY = 75;

// kind: 'background' (full-bleed, needs headroom above 1920px viewports)
// vs 'sprite' (character/prop cutouts with alpha, never shown full-bleed).
const images = [
  { file: 'hero page_background.png', name: 'hero-background', kind: 'background' },
  { file: 'tree_day.png', name: 'tree-day', kind: 'background' },
  { file: 'trr_night.png', name: 'tree-night', kind: 'background' },
  { file: '拿著槍的手.png', name: 'gun-hand', kind: 'sprite' },
  { file: 'character_hanging upside down.png', name: 'character-hanging', kind: 'sprite' },
  { file: 'character_walk.png', name: 'character-walk', kind: 'sprite' },
  { file: 'tree_ribbon.png', name: 'tree-ribbon', kind: 'sprite' },
  { file: 'single_flower.png', name: 'single-flower', kind: 'sprite' },
];

async function optimize({ file, name, kind }) {
  const inputPath = path.join(SOURCE_DIR, file);
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const maxEdge = kind === 'sprite' ? SPRITE_MAX_EDGE : BACKGROUND_MAX_EDGE;
  const isWide = metadata.width >= metadata.height;
  const needsResize = Math.max(metadata.width, metadata.height) > maxEdge;

  const pipeline = needsResize
    ? image.resize(isWide ? maxEdge : null, isWide ? null : maxEdge, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    : image;

  const outputPath = path.join(OUTPUT_DIR, `${name}.webp`);
  await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);
  console.log(`optimized ${file} -> ${path.relative(process.cwd(), outputPath)}`);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const entry of images) {
    await optimize(entry);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
