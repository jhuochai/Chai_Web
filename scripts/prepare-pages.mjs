import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Real entry files let direct station links refresh on static GitHub Pages.
const output = resolve('dist-pages');
for (const station of ['profile', 'career-tree', 'portfolio', 'ai-lab', 'making-of']) {
  await mkdir(resolve(output, station), { recursive: true });
  await copyFile(resolve(output, 'index.html'), resolve(output, station, 'index.html'));
}
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Prepared five direct station entry points for GitHub Pages.');
