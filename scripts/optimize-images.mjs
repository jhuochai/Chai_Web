import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SOURCE_DIR = path.resolve('設計參考');
const OUTPUT_DIR = path.resolve('src/assets/scenes');
const MAX_EDGE = 2400;
const WEBP_QUALITY = 75;

const images = [
  { file: 'hero page_background.png', name: 'hero-background' },
  { file: 'tree_day.png', name: 'tree-day' },
];

async function optimize({ file, name }) {
  const inputPath = path.join(SOURCE_DIR, file);
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const isWide = metadata.width >= metadata.height;
  const needsResize = Math.max(metadata.width, metadata.height) > MAX_EDGE;

  const pipeline = needsResize
    ? image.resize(isWide ? MAX_EDGE : null, isWide ? null : MAX_EDGE, {
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
