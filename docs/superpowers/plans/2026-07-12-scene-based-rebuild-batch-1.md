# Scene-Based Rebuild — Batch 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the site from the 4-module SPA into the skeleton of the 8-scene cinematic layout, with Scene 1 (Hero) and Scene 7 (Contact) fully built and Scene 5 (Portfolio) re-anchored as-is.

**Architecture:** One continuous-scroll `<main>` with eight `<section id="scene-0">` … `<section id="scene-7">` elements. Five of them (0, 2, 3, 4, 6) are a shared `SceneSkeleton` placeholder component; Hero, Portfolio, and Contact are full components. No scroll-snap, no GSAP yet (deferred to Batch 2 per the spec).

**Tech Stack:** React 19 + Vite, `motion/react` (already in use), `@phosphor-icons/react` (the project's one icon library — the spec's "Lucide-style" hamburger icon reference is a stylistic cue, not a second icon package), Vitest + React Testing Library (new this batch), `sharp` (new, dev-only, for the one-off image optimization script).

## Global Constraints

- One icon family per project: `@phosphor-icons/react` only. Do not add `lucide-react` even though the spec references "Lucide-style" icon behavior — reproduce the same crossfade/rotation interaction with Phosphor's `List`/`X` icons.
- One frame system: `FramedPanel` + `CrackTexture`, extended with a new `variant="deco"`, not a parallel component.
- Bilingual content only lives in `src/data/content.js` (`content.en` / `content.zh`); no hardcoded UI strings in components.
- Reference spec: `docs/superpowers/specs/2026-07-12-scene-based-rebuild-batch-1-design.md` — every task below implements a section of it.
- Source images live in `設計參考/` (untouched, not committed-over); optimized copies for actual app use live in `src/assets/scenes/`.
- Commit after every task.

---

### Task 1: Test harness (Vitest + React Testing Library)

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `src/test/setup.js`
- Create: `src/test/smoke.test.jsx`

**Interfaces:**
- Produces: `npm test` runs Vitest once (CI mode); every later task's test file is picked up automatically by Vitest's default `**/*.test.jsx` glob.

- [ ] **Step 1: Install the test dependencies**

Run: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
Expected: adds four packages under `devDependencies` in `package.json`.

- [ ] **Step 2: Add the test script to package.json**

Modify the `scripts` block:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "test": "vitest run"
  },
```

Also fix the leftover scaffold name while touching this file:

```json
  "name": "chai-yi-chen-portfolio",
```

(replaces the current `"name": "tmp-scaffold"` on line 2.)

- [ ] **Step 3: Point Vitest at jsdom and the setup file**

Modify `vite.config.js` to the full contents:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
```

- [ ] **Step 4: Write the setup file**

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia; motion/react's useReducedMotion()
// calls it on every component that imports it (Hero, Nav, etc.).
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom doesn't implement ResizeObserver either; several components
// (CircularGallery, ClickSpark) use it and will throw on mount without this.
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
```

- [ ] **Step 5: Write a smoke test to prove the harness works**

Create `src/test/smoke.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';

function Hello() {
  return <p>hello test harness</p>;
}

describe('test harness smoke test', () => {
  it('renders a component and finds it with RTL queries', () => {
    render(<Hello />);
    expect(screen.getByText('hello test harness')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it**

Run: `npm test`
Expected: `1 passed` (the smoke test), no other test files exist yet so nothing else runs.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js src/test/
git commit -m "test: add Vitest + React Testing Library harness"
```

---

### Task 2: Image optimization script + optimized Batch 1 assets

**Files:**
- Create: `scripts/optimize-images.mjs`
- Create (generated, not hand-written): `src/assets/scenes/hero-background.webp`
- Create (generated, not hand-written): `src/assets/scenes/tree-day.webp`

**Interfaces:**
- Produces: `src/assets/scenes/hero-background.webp`, `src/assets/scenes/tree-day.webp` — these exact paths are imported by Task 8 (Hero) and Task 4/11 (Scene 3 skeleton).

- [ ] **Step 1: Install sharp**

Run: `npm install -D sharp`
Expected: adds `sharp` under `devDependencies`.

- [ ] **Step 2: Write the optimization script**

Create `scripts/optimize-images.mjs`:

```js
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SOURCE_DIR = path.resolve('設計參考');
const OUTPUT_DIR = path.resolve('src/assets/scenes');
const MAX_EDGE = 2400;
const WEBP_QUALITY = 82;

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
```

- [ ] **Step 3: Run it**

Run: `node scripts/optimize-images.mjs`
Expected output:
```
optimized hero page_background.png -> src/assets/scenes/hero-background.webp
optimized tree_day.png -> src/assets/scenes/tree-day.webp
```

- [ ] **Step 4: Verify the output sizes are actually small**

Run:
```bash
for f in src/assets/scenes/*.webp; do
  size=$(stat -c%s "$f" 2>/dev/null || stat -f%z "$f")
  echo "$f: $size bytes"
  if [ "$size" -gt 410000 ]; then echo "FAIL: $f exceeds 400KB target"; exit 1; fi
done
```
Expected: both files print their byte size and neither triggers the FAIL line (each should land well under 400KB coming from a 2400px-capped WebP at quality 82 — typically in the 50–250KB range for painterly source art).

- [ ] **Step 5: Commit**

```bash
git add scripts/optimize-images.mjs src/assets/scenes/ package.json package-lock.json
git commit -m "build: add image optimization script and Batch 1 scene assets"
```

---

### Task 3: Content data — nav relabel + scene placeholder copy

**Files:**
- Modify: `src/data/content.js`

**Interfaces:**
- Consumes: nothing new.
- Produces: `content.en.nav.{home,story,work,cta,langToggleLabel}` (renamed from `{home,about,portfolio,contact,cta,langToggleLabel}`), `content.en.scenes.{scene0,scene2,scene3,scene4,scene6}` each `{ title, note }`. Mirrored on `content.zh`. `content.en.highlights` / `content.en.title` are unchanged and reused as-is by Task 8.

- [ ] **Step 1: Write the failing test**

Create `src/data/content.test.js`:

```js
import { content } from './content';

describe('content.nav', () => {
  it('has the curated 3-link nav plus cta/lang toggle, in both languages', () => {
    for (const lang of ['en', 'zh']) {
      expect(content[lang].nav).toEqual(
        expect.objectContaining({
          home: expect.any(String),
          story: expect.any(String),
          work: expect.any(String),
          cta: expect.any(String),
          langToggleLabel: expect.any(String),
        })
      );
      expect(content[lang].nav.about).toBeUndefined();
      expect(content[lang].nav.portfolio).toBeUndefined();
      expect(content[lang].nav.contact).toBeUndefined();
    }
  });
});

describe('content.scenes', () => {
  it('has placeholder title+note for every skeleton scene, in both languages', () => {
    for (const lang of ['en', 'zh']) {
      for (const key of ['scene0', 'scene2', 'scene3', 'scene4', 'scene6']) {
        expect(content[lang].scenes[key]).toEqual(
          expect.objectContaining({ title: expect.any(String), note: expect.any(String) })
        );
      }
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/data/content.test.js`
Expected: FAIL — `content[lang].nav.story` is undefined (nav still has the old shape), and `content[lang].scenes` doesn't exist yet.

- [ ] **Step 3: Update the `en` nav block**

In `src/data/content.js`, replace (around line 2):

```js
  nav: {
    home: 'Home',
    about: 'Experience',
    portfolio: 'Work',
    contact: 'Contact',
    cta: 'Contact Me',
    langToggleLabel: 'Switch to Chinese',
  },
```

with:

```js
  nav: {
    home: 'Home',
    story: 'Story',
    work: 'Work',
    cta: 'Contact Me',
    langToggleLabel: 'Switch to Chinese',
  },
```

- [ ] **Step 4: Update the `zh` nav block**

Replace (around line 188):

```js
  nav: {
    home: '首頁',
    about: '個人經歷',
    portfolio: '精選項目',
    contact: '聯繫',
    cta: '聯繫我',
    langToggleLabel: '切換成英文',
```

with:

```js
  nav: {
    home: '首頁',
    story: '故事',
    work: '精選項目',
    cta: '聯繫我',
    langToggleLabel: '切換成英文',
```

(the line after this, `},`, is unchanged — only the key names inside the object change).

- [ ] **Step 5: Add the `scenes` block to `en`**

Find the closing of the `en` object — it ends with:

```js
  ui: {
    portraitNote: 'Placeholder photo, real portrait coming soon',
    imageNote: 'Placeholder visual, real screenshot coming soon',
    workLabel: 'Approach',
    resultLabel: 'Result',
    timelineHeading: 'Experience Timeline',
    credentialsLabel: 'Credentials',
    footerTag: 'Chai Yi Chen · Game Marketing Coordinator',
  },
};
```

Insert a new `scenes` key right before the final `};` that closes `en`:

```js
  scenes: {
    scene0: { title: 'Scene 0 — Loading', note: 'Content coming in a later pass' },
    scene2: { title: 'Scene 2 — Introduction', note: 'Content coming in a later pass' },
    scene3: { title: 'Scene 3 — Career Tree', note: 'Content coming in a later pass' },
    scene4: { title: 'Scene 4 — Interests', note: 'Content coming in a later pass' },
    scene6: { title: 'Scene 6 — How This Was Built', note: 'Content coming in a later pass' },
  },
};
```

- [ ] **Step 6: Add the `scenes` block to `zh`**

The `zh` object ends the same way:

```js
  ui: {
    portraitNote: '暫用素材，正式人像待補',
    imageNote: '暫用素材，正式截圖待補',
    workLabel: '做法',
    resultLabel: '成效',
    timelineHeading: '經歷時間軸',
    credentialsLabel: '學歷與資格認證',
    footerTag: '柴怡辰 · 遊戲行銷企劃',
  },
};

export const content = { en, zh };
```

Insert before the `};` that closes `zh` (i.e. right before the blank line + `export const content`):

```js
  scenes: {
    scene0: { title: '第零幕｜開場', note: '內容製作中' },
    scene2: { title: '第二幕｜自我介紹', note: '內容製作中' },
    scene3: { title: '第三幕｜生涯大樹', note: '內容製作中' },
    scene4: { title: '第四幕｜興趣與長處', note: '內容製作中' },
    scene6: { title: '第六幕｜製作過程', note: '內容製作中' },
  },
};

export const content = { en, zh };
```

- [ ] **Step 7: Run the test again to verify it passes**

Run: `npx vitest run src/data/content.test.js`
Expected: `2 passed`.

- [ ] **Step 8: Commit**

```bash
git add src/data/content.js src/data/content.test.js
git commit -m "feat(content): relabel nav for scene anchors, add scene placeholder copy"
```

---

### Task 4: `SceneSkeleton` shared placeholder component

**Files:**
- Create: `src/components/SceneSkeleton.jsx`
- Create: `src/components/SceneSkeleton.css`
- Test: `src/components/SceneSkeleton.test.jsx`

**Interfaces:**
- Consumes: nothing from other tasks (pure presentational component).
- Produces: `<SceneSkeleton id="scene-2" title="..." note="..." backgroundUrl={optional string} />` — a `<section>` with the given `id`, centered title/note text, and (if `backgroundUrl` is passed) a full-bleed background image; renders a plain `--void` background when `backgroundUrl` is omitted. Used by Task 11 for scenes 0, 2, 3, 4, 6.

- [ ] **Step 1: Write the failing test**

Create `src/components/SceneSkeleton.test.jsx`:

```jsx
import { render } from '@testing-library/react';
import SceneSkeleton from './SceneSkeleton';

describe('SceneSkeleton', () => {
  it('renders a section with the given id and the title/note text', () => {
    const { container, getByText } = render(
      <SceneSkeleton id="scene-4" title="Scene 4 — Interests" note="Content coming in a later pass" />
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('id', 'scene-4');
    expect(getByText('Scene 4 — Interests')).toBeInTheDocument();
    expect(getByText('Content coming in a later pass')).toBeInTheDocument();
  });

  it('has no background-image style when backgroundUrl is omitted', () => {
    const { container } = render(<SceneSkeleton id="scene-2" title="t" note="n" />);
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toBe('');
  });

  it('sets a background-image style when backgroundUrl is provided', () => {
    const { container } = render(
      <SceneSkeleton id="scene-3" title="t" note="n" backgroundUrl="/fake/tree-day.webp" />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('/fake/tree-day.webp');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/SceneSkeleton.test.jsx`
Expected: FAIL — `Cannot find module './SceneSkeleton'`.

- [ ] **Step 3: Write the component**

Create `src/components/SceneSkeleton.jsx`:

```jsx
import './SceneSkeleton.css';

/**
 * Shared placeholder for scenes that don't have their real content/
 * interactivity built yet (Batch 2/3). Confirms the scroll rhythm and
 * anchor wiring now without pretending these scenes are finished.
 */
export default function SceneSkeleton({ id, title, note, backgroundUrl }) {
  return (
    <section
      id={id}
      className="scene-skeleton"
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
    >
      <div className="scene-skeleton__scrim" aria-hidden="true" />
      <div className="scene-skeleton__content">
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write the CSS**

Create `src/components/SceneSkeleton.css`:

```css
.scene-skeleton {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--void);
  background-size: cover;
  background-position: center;
}

.scene-skeleton__scrim {
  position: absolute;
  inset: 0;
  background: rgba(21, 18, 16, 0.55);
}

.scene-skeleton__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding-inline: 24px;
}

.scene-skeleton__content h2 {
  font-size: clamp(24px, 3vw, 34px);
  color: var(--parchment);
  margin-bottom: 10px;
}

.scene-skeleton__content p {
  font-family: var(--mono);
  font-size: 12.5px;
  letter-spacing: 0.06em;
  color: var(--parchment-faint);
}
```

- [ ] **Step 5: Run the test again to verify it passes**

Run: `npx vitest run src/components/SceneSkeleton.test.jsx`
Expected: `3 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/SceneSkeleton.jsx src/components/SceneSkeleton.css src/components/SceneSkeleton.test.jsx
git commit -m "feat: add SceneSkeleton placeholder component"
```

---

### Task 5: FramedPanel Art Deco frame variant

**Files:**
- Modify: `src/components/CrackTexture.jsx`
- Modify: `src/components/FramedPanel.jsx`
- Modify: `src/components/FramedPanel.css`
- Test: `src/components/FramedPanel.test.jsx`

**Interfaces:**
- Produces: `<FramedPanel variant="deco">` renders `framed-panel--deco` on the wrapper and `crack-texture--deco` on the inner SVG. Used by Task 8 (Hero) and Task 9 (Contact).

- [ ] **Step 1: Write the failing test**

Create `src/components/FramedPanel.test.jsx`:

```jsx
import { render } from '@testing-library/react';
import FramedPanel from './FramedPanel';

describe('FramedPanel deco variant', () => {
  it('renders the deco frame class on the wrapper and the deco crack texture', () => {
    const { container } = render(<FramedPanel variant="deco">content</FramedPanel>);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('framed-panel--deco');
    expect(container.querySelector('.crack-texture--deco')).not.toBeNull();
  });

  it('still renders the existing corners variant unchanged', () => {
    const { container } = render(<FramedPanel variant="corners">content</FramedPanel>);
    expect(container.querySelector('.crack-texture--corners')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/FramedPanel.test.jsx`
Expected: FAIL — `crack-texture--deco` not found (CrackTexture only knows `wild`/`corners`).

- [ ] **Step 3: Add the deco SVG to CrackTexture**

In `src/components/CrackTexture.jsx`, the file currently ends the `corners` branch like this:

```jsx
  return (
    <svg
      className={`crack-texture crack-texture--corners ${className}`}
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 40 L4 4 L40 4" className="crack-line crack-line--thin" />
      <path d="M4 26 L18 26 L26 18 L26 4" className="crack-line crack-line--thin" />
      <path d="M396 40 L396 4 L360 4" className="crack-line crack-line--thin" />
      <path d="M396 26 L382 26 L374 18 L374 4" className="crack-line crack-line--thin" />
      <path d="M4 460 L4 496 L40 496" className="crack-line crack-line--thin" />
      <path d="M4 474 L18 474 L26 482 L26 496" className="crack-line crack-line--thin" />
      <path d="M396 460 L396 496 L360 496" className="crack-line crack-line--thin" />
      <path d="M396 474 L382 474 L374 482 L374 496" className="crack-line crack-line--thin" />
    </svg>
  );
}
```

Add a new `deco` branch before this final `return`, right after the `wild` branch's closing `}`:

```jsx
  if (variant === 'deco') {
    return (
      <svg
        className={`crack-texture crack-texture--deco ${className}`}
        viewBox="0 0 400 500"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* Outer rectilinear border */}
        <path
          d="M18 18 L382 18 L382 482 L18 482 Z"
          className="crack-line crack-line--thin"
        />
        {/* Inner nested border, Art Deco double-line frame */}
        <path
          d="M30 30 L370 30 L370 470 L30 470 Z"
          className="crack-line crack-line--thin"
        />
        {/* Corner notches, all four corners */}
        <path d="M18 46 L34 46 L34 18" className="crack-line" />
        <path d="M382 46 L366 46 L366 18" className="crack-line" />
        <path d="M18 454 L34 454 L34 482" className="crack-line" />
        <path d="M382 454 L366 454 L366 482" className="crack-line" />
        {/* Symmetric corner step-diamonds, the Art Deco signature detail */}
        <path d="M18 18 L40 40" className="crack-line crack-line--thin" />
        <path d="M382 18 L360 40" className="crack-line crack-line--thin" />
        <path d="M18 482 L40 460" className="crack-line crack-line--thin" />
        <path d="M382 482 L360 460" className="crack-line crack-line--thin" />
      </svg>
    );
  }

```

(this is inserted as a new `if` block; the existing `wild` branch and the final `corners` `return` stay exactly as they are).

- [ ] **Step 4: Pass the `deco` variant through in FramedPanel**

In `src/components/FramedPanel.jsx`, replace:

```jsx
      <CrackTexture variant={variant === 'wild' ? 'wild' : 'corners'} />
```

with:

```jsx
      <CrackTexture variant={variant === 'wild' || variant === 'deco' ? variant : 'corners'} />
```

- [ ] **Step 5: Add the deco frame border styling**

In `src/components/FramedPanel.css`, after the existing `.framed-panel--wild` rules, add:

```css
.framed-panel--deco {
  border-color: rgba(201, 162, 75, 0.4);
}

.framed-panel--deco::before {
  border-color: rgba(201, 162, 75, 0.22);
  inset: 10px;
}
```

- [ ] **Step 6: Run the test again to verify it passes**

Run: `npx vitest run src/components/FramedPanel.test.jsx`
Expected: `2 passed`.

- [ ] **Step 7: Commit**

```bash
git add src/components/CrackTexture.jsx src/components/FramedPanel.jsx src/components/FramedPanel.css src/components/FramedPanel.test.jsx
git commit -m "feat: add Art Deco frame variant to FramedPanel/CrackTexture"
```

---

### Task 6: `MobileMenu` fullscreen glass overlay

**Files:**
- Create: `src/components/MobileMenu.jsx`
- Create: `src/components/MobileMenu.css`
- Test: `src/components/MobileMenu.test.jsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `<MobileMenu open={bool} links={[{href, label}]} onClose={fn} />`. Used by Task 7 (Nav).

- [ ] **Step 1: Write the failing test**

Create `src/components/MobileMenu.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from './MobileMenu';

const links = [
  { href: '#scene-1', label: 'Home' },
  { href: '#scene-3', label: 'Story' },
  { href: '#scene-5', label: 'Work' },
];

describe('MobileMenu', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<MobileMenu open={false} links={links} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders every link with a staggered transition delay when open', () => {
    render(<MobileMenu open links={links} onClose={() => {}} />);
    const items = screen.getAllByRole('link');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute('href', '#scene-1');
    expect(items[0]).toHaveStyle({ transitionDelay: '100ms' });
    expect(items[1]).toHaveStyle({ transitionDelay: '150ms' });
    expect(items[2]).toHaveStyle({ transitionDelay: '200ms' });
  });

  it('calls onClose when a link is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenu open links={links} onClose={onClose} />);
    fireEvent.click(screen.getAllByRole('link')[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<MobileMenu open links={links} onClose={onClose} />);
    fireEvent.click(container.querySelector('.mobile-menu'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/MobileMenu.test.jsx`
Expected: FAIL — `Cannot find module './MobileMenu'`.

- [ ] **Step 3: Write the component**

Create `src/components/MobileMenu.jsx`:

```jsx
import './MobileMenu.css';

const BASE_DELAY_MS = 100;
const STEP_DELAY_MS = 50;

export default function MobileMenu({ open, links, onClose }) {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="mobile-menu" onClick={handleBackdropClick}>
      <nav className="mobile-menu__links" aria-label="Mobile">
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            style={{ transitionDelay: `${BASE_DELAY_MS + index * STEP_DELAY_MS}ms` }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Write the CSS**

Create `src/components/MobileMenu.css`:

```css
.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(21, 18, 16, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.mobile-menu__links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.mobile-menu__links a {
  font-family: var(--display);
  font-size: 32px;
  color: var(--parchment);
  text-decoration: none;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  animation: mobile-menu-in 0.01ms forwards;
  animation-delay: inherit;
}

@keyframes mobile-menu-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu__links a {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 5: Run the test again to verify it passes**

Run: `npx vitest run src/components/MobileMenu.test.jsx`
Expected: `4 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/MobileMenu.jsx src/components/MobileMenu.css src/components/MobileMenu.test.jsx
git commit -m "feat: add MobileMenu fullscreen glass overlay"
```

---

### Task 7: Nav rewrite — curated scene links + hamburger

**Files:**
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/Nav.css`
- Test: `src/components/Nav.test.jsx`

**Interfaces:**
- Consumes: `content.en.nav.{home,story,work,cta,langToggleLabel}` (Task 3), `<MobileMenu>` (Task 6).
- Produces: desktop links pointing to `#scene-1`, `#scene-3`, `#scene-5`; a hamburger button that toggles `MobileMenu`.

- [ ] **Step 1: Write the failing test**

Create `src/components/Nav.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from './Nav';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderNav() {
  return render(
    <LanguageProvider>
      <Nav />
    </LanguageProvider>
  );
}

describe('Nav', () => {
  it('renders the curated 3-link desktop nav pointing at the new scene anchors', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#scene-1');
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute('href', '#scene-3');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#scene-5');
  });

  it('opens the mobile menu when the hamburger button is clicked', () => {
    renderNav();
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/Nav.test.jsx`
Expected: FAIL — no "Story"/"Work" links exist yet (still "Experience" pointing to `#about`), and no hamburger button exists.

- [ ] **Step 3: Rewrite Nav.jsx**

Replace the full contents of `src/components/Nav.jsx`:

```jsx
import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { Globe, List, X } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import MobileMenu from './MobileMenu';
import './Nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { lang, toggleLang, t } = useLanguage();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled((prev) => {
      const next = latest > 48;
      return prev === next ? prev : next;
    });
  });

  const links = [
    { href: '#scene-1', label: t.nav.home },
    { href: '#scene-3', label: t.nav.story },
    { href: '#scene-5', label: t.nav.work },
  ];

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <a href="#scene-1" className="nav__mark">
          {t.name.display}
          <span className="nav__mark-sub">{t.name.sub}</span>
        </a>
        <nav className="nav__links" aria-label={lang === 'zh' ? '主要導覽' : 'Primary'}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <button
            type="button"
            className="nav__lang btn-glass btn-glass--ghost"
            onClick={toggleLang}
            aria-label={t.nav.langToggleLabel}
          >
            <Globe size={15} weight="light" />
            <span>{lang === 'en' ? 'EN' : '中'}</span>
          </button>
          <a href="#scene-7" className="nav__cta btn-glass">
            {t.nav.cta}
          </a>
          <button
            type="button"
            className="nav__hamburger btn-glass btn-glass--ghost"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={`nav__hamburger-icon ${menuOpen ? 'nav__hamburger-icon--open' : ''}`}>
              <List size={20} weight="light" className="nav__hamburger-menu-glyph" />
              <X size={20} weight="light" className="nav__hamburger-close-glyph" />
            </span>
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} links={links} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
```

- [ ] **Step 4: Add the hamburger button styles (desktop-hidden, mobile-visible) and crossfade icon rotation**

In `src/components/Nav.css`, replace the existing mobile media query block:

```css
@media (max-width: 860px) {
  .nav__links {
    display: none;
  }
  .nav__mark-sub {
    display: none;
  }
}
```

with:

```css
.nav__hamburger {
  display: none;
  padding: 10px;
}

.nav__hamburger-icon {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
}

.nav__hamburger-menu-glyph,
.nav__hamburger-close-glyph {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.nav__hamburger-close-glyph {
  opacity: 0;
  transform: rotate(-90deg) scale(0.75);
}

.nav__hamburger-icon--open .nav__hamburger-menu-glyph {
  opacity: 0;
  transform: rotate(90deg) scale(0.75);
}

.nav__hamburger-icon--open .nav__hamburger-close-glyph {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

@media (max-width: 860px) {
  .nav__links {
    display: none;
  }
  .nav__mark-sub {
    display: none;
  }
  .nav__hamburger {
    display: inline-flex;
  }
}
```

- [ ] **Step 5: Run the test again to verify it passes**

Run: `npx vitest run src/components/Nav.test.jsx`
Expected: `2 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.jsx src/components/Nav.css src/components/Nav.test.jsx
git commit -m "feat(nav): curated scene-anchor links + mobile hamburger menu"
```

---

### Task 8: Hero rebuild — static background, badge, deco frame, stats row

**Files:**
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Hero.css`
- Test: `src/components/Hero.test.jsx`

**Interfaces:**
- Consumes: `src/assets/scenes/hero-background.webp` (Task 2), `FramedPanel variant="deco"` (Task 5), `content.en.highlights` (existing, unchanged).
- Produces: `<section id="scene-1">` with badge, deco-framed nameplate, positioning statement, and a bottom stats row. The video crossfade-loop system from the earlier build is removed (superseded by the finalized static hero image — the old code is preserved in git history at commit `2be81b4` if ever needed).

- [ ] **Step 1: Write the failing test**

Create `src/components/Hero.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderHero() {
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}

describe('Hero', () => {
  it('renders as #scene-1', () => {
    const { container } = renderHero();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-1');
  });

  it('shows the badge and the deco-framed nameplate', () => {
    const { container } = renderHero();
    expect(screen.getAllByText('Game Marketing Coordinator').length).toBeGreaterThan(0);
    expect(container.querySelector('.framed-panel--deco')).not.toBeNull();
  });

  it('shows all three real highlight stats', () => {
    renderHero();
    expect(screen.getByText(/67%/)).toBeInTheDocument();
    expect(screen.getByText(/IG follower growth/)).toBeInTheDocument();
    expect(screen.getByText(/GA/)).toBeInTheDocument();
    expect(screen.getByText(/24/)).toBeInTheDocument();
  });

  it('has no video element anymore', () => {
    const { container } = renderHero();
    expect(container.querySelector('video')).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/Hero.test.jsx`
Expected: FAIL — section id is still `hero`, no `.framed-panel--deco`, no stats text, and a `<video>` still exists.

- [ ] **Step 3: Rewrite Hero.jsx**

Replace the full contents of `src/components/Hero.jsx`:

```jsx
import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import FramedPanel from './FramedPanel';
import VariableProximity from './VariableProximity';
import { useLanguage } from '../i18n/LanguageContext';
import heroBackground from '../assets/scenes/hero-background.webp';
import './Hero.css';

const nameRise = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const reduce = useReducedMotion();
  const { lang, t } = useLanguage();
  const nameWrapRef = useRef(null);

  return (
    <section id="scene-1" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src={heroBackground} alt="" className="hero__bg-image" />
        <div className="hero__fog" />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content container">
        <motion.span
          className="hero__badge btn-glass btn-glass--ghost"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.title}
        </motion.span>

        <FramedPanel as="div" variant="deco" className="hero__nameplate">
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h1
              className={`hero__name ${lang === 'en' ? 'hero__name--latin' : ''}`}
              variants={nameRise}
              custom={0}
            >
              <span ref={nameWrapRef} className="hero__name-proximity">
                <VariableProximity
                  label={t.name.display}
                  containerRef={nameWrapRef}
                  fromFontVariationSettings="'wght' 560, 'opsz' 40"
                  toFontVariationSettings="'wght' 900, 'opsz' 144"
                  radius={140}
                  falloff="exponential"
                />
              </span>
            </motion.h1>
            <motion.p className="hero__name-en" variants={nameRise} custom={1}>
              {t.name.sub}
            </motion.p>
          </motion.div>
        </FramedPanel>

        <motion.p
          className="hero__positioning"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.positioning.before}
          <em>{t.positioning.emphasis}</em>
          {t.positioning.after}
        </motion.p>

        <motion.ul
          className="hero__stats"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.highlights.map((h) => (
            <li key={h.label}>
              {h.value} {h.label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Update Hero.css — replace the video rule, add badge and stats rules**

Replace:

```css
.hero__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.35) sepia(0.18) brightness(0.55) contrast(1.05);
}
```

with:

```css
.hero__bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.15) brightness(0.7) saturate(1.05);
}
```

Then, after the `.hero__positioning em` rule, add:

```css
.hero__badge {
  display: inline-flex;
  font-family: var(--mono);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  padding: 8px 18px;
  margin-bottom: 8px;
}

.hero__stats {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(20px, 4vh, 40px);
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-inline: 24px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--parchment-dim);
}

.hero__stats li {
  position: relative;
  padding-right: 20px;
}

.hero__stats li:not(:last-child)::after {
  content: '|';
  position: absolute;
  right: 0;
  color: var(--hairline);
}

.hero__stats li:last-child {
  padding-right: 0;
}
```

- [ ] **Step 5: Run the test again to verify it passes**

Run: `npx vitest run src/components/Hero.test.jsx`
Expected: `4 passed`.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.jsx src/components/Hero.css src/components/Hero.test.jsx
git commit -m "feat(hero): static background image, badge, deco frame, stats row"
```

---

### Task 9: Contact re-anchor + deco frame echo

**Files:**
- Modify: `src/components/Contact.jsx`
- Test: `src/components/Contact.test.jsx`

**Interfaces:**
- Consumes: `FramedPanel variant="deco"` (Task 5).
- Produces: `<section id="scene-7">` (was `id="contact"`).

- [ ] **Step 1: Write the failing test**

Create `src/components/Contact.test.jsx`:

```jsx
import { render } from '@testing-library/react';
import Contact from './Contact';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('Contact', () => {
  it('renders as #scene-7 with the deco frame', () => {
    const { container } = render(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-7');
    expect(container.querySelector('.framed-panel--deco')).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/Contact.test.jsx`
Expected: FAIL — section id is still `contact`, frame variant is still `corners`.

- [ ] **Step 3: Update Contact.jsx**

Two one-line changes. Replace:

```jsx
    <section id="contact" className="closing">
```

with:

```jsx
    <section id="scene-7" className="closing">
```

Replace:

```jsx
          <FramedPanel variant="corners" className="closing__panel">
```

with:

```jsx
          <FramedPanel variant="deco" className="closing__panel">
```

- [ ] **Step 4: Run the test again to verify it passes**

Run: `npx vitest run src/components/Contact.test.jsx`
Expected: `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Contact.jsx src/components/Contact.test.jsx
git commit -m "feat(contact): re-anchor as scene-7, echo the deco frame"
```

---

### Task 10: Portfolio re-anchor

**Files:**
- Modify: `src/components/Portfolio.jsx`
- Test: `src/components/Portfolio.test.jsx`

**Interfaces:**
- Produces: `<section id="scene-5">` (was `id="portfolio"`).

**Note:** `Portfolio` mounts `CircularGallery`, which creates a real WebGL context via `ogl` — jsdom has no WebGL, so the test mocks `CircularGallery` out entirely rather than exercising it.

- [ ] **Step 1: Write the failing test**

Create `src/components/Portfolio.test.jsx`:

```jsx
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Portfolio from './Portfolio';
import { LanguageProvider } from '../i18n/LanguageContext';

vi.mock('./CircularGallery', () => ({
  default: () => <div data-testid="circular-gallery-stub" />,
}));

describe('Portfolio', () => {
  it('renders as #scene-5', () => {
    const { container } = render(
      <LanguageProvider>
        <Portfolio />
      </LanguageProvider>
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-5');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/Portfolio.test.jsx`
Expected: FAIL — section id is still `portfolio`.

- [ ] **Step 3: Update Portfolio.jsx**

Replace:

```jsx
    <section id="portfolio" className="portfolio">
```

with:

```jsx
    <section id="scene-5" className="portfolio">
```

- [ ] **Step 4: Run the test again to verify it passes**

Run: `npx vitest run src/components/Portfolio.test.jsx`
Expected: `1 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Portfolio.jsx src/components/Portfolio.test.jsx
git commit -m "feat(portfolio): re-anchor as scene-5"
```

---

### Task 11: Assemble the 8-scene App

**Files:**
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: `SceneSkeleton` (Task 4), `Hero`/`Portfolio`/`Contact` (Tasks 8/10/9), `src/assets/scenes/tree-day.webp` (Task 2), `content.en.scenes` (Task 3).
- Produces: eight sections in document order, ids `scene-0` through `scene-7`.

**Note:** the full `App` renders `ClickSpark` (canvas 2D, unsupported in jsdom) and `Portfolio` → `CircularGallery` (WebGL, unsupported in jsdom). Both are mocked in this test so the tree can render without crashing.

- [ ] **Step 1: Write the failing test**

Create `src/App.test.jsx`:

```jsx
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./components/ClickSpark', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('./components/CircularGallery', () => ({
  default: () => <div data-testid="circular-gallery-stub" />,
}));

describe('App', () => {
  it('renders all 8 scenes in order', () => {
    const { container } = render(<App />);
    const ids = Array.from(container.querySelectorAll('main > section')).map((el) => el.id);
    expect(ids).toEqual([
      'scene-0',
      'scene-1',
      'scene-2',
      'scene-3',
      'scene-4',
      'scene-5',
      'scene-6',
      'scene-7',
    ]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/App.test.jsx`
Expected: FAIL — `App` still renders `Hero`/`About`/`Portfolio`/`Contact` with old ids (`hero`, no `about` section id at all since `About` never had a top-level scene id, `portfolio`, `contact`) and only 3 sections total under `main`, and `LoadingScreen` covers the tree on first render (see Step 3's note on `loading` state) — also fails simply because the scene-0/2/3/4/6 sections don't exist yet.

- [ ] **Step 3: Rewrite App.jsx**

Replace the full contents of `src/App.jsx`:

```jsx
import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import SceneSkeleton from './components/SceneSkeleton';
import GrainOverlay from './components/GrainOverlay';
import ClickSpark from './components/ClickSpark';
import LoadingScreen from './components/LoadingScreen';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import treeDayBackground from './assets/scenes/tree-day.webp';

function Scenes() {
  const { t } = useLanguage();
  const { scenes } = t;

  return (
    <main>
      <SceneSkeleton id="scene-0" title={scenes.scene0.title} note={scenes.scene0.note} />
      <Hero />
      <SceneSkeleton id="scene-2" title={scenes.scene2.title} note={scenes.scene2.note} />
      <SceneSkeleton
        id="scene-3"
        title={scenes.scene3.title}
        note={scenes.scene3.note}
        backgroundUrl={treeDayBackground}
      />
      <SceneSkeleton id="scene-4" title={scenes.scene4.title} note={scenes.scene4.note} />
      <Portfolio />
      <SceneSkeleton id="scene-6" title={scenes.scene6.title} note={scenes.scene6.note} />
      <Contact />
    </main>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <LanguageProvider>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <ClickSpark sparkColor="#e0bc6a" sparkSize={9} sparkRadius={17} sparkCount={5} duration={550}>
        <GrainOverlay />
        <Nav />
        <Scenes />
      </ClickSpark>
    </LanguageProvider>
  );
}

export default App;
```

Note: `About` is no longer imported or rendered. Its content (traits, personality blurb, experience timeline, skills, credentials) isn't deleted — it's exactly the material Batch 2/3 redistributes into Scenes 2, 3, and 4, so `src/components/About.jsx`/`About.css` stay in the repo unused for now rather than being rewritten from scratch later.

- [ ] **Step 4: Run the test again to verify it passes**

Run: `npx vitest run src/App.test.jsx`
Expected: `1 passed`.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: every test file from Tasks 1–11 passes (smoke test, content, SceneSkeleton, FramedPanel, MobileMenu, Nav, Hero, Contact, Portfolio, App).

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/App.test.jsx
git commit -m "feat(app): assemble the 8-scene layout"
```

---

### Task 12: Manual browser verification

This task has no automated test — it's a visual/interaction pass the automated suite can't cover (real image loads, scroll rhythm, focus handling, contrast).

- [ ] **Step 1: Start the dev server and open it**

Use the project's dev server (already configured in `.claude/launch.json`) and load the page at 1440×900.

- [ ] **Step 2: Scroll through all 8 scenes in order**

Confirm: Scene 0 is an empty void section, Scene 1 shows the starry-night background with badge/deco-framed name/positioning/stats row, Scene 2/4/6 are empty void placeholders with their title/note text, Scene 3 shows the `tree_day` background with its placeholder text, Scene 5 is the untouched Portfolio carousel, Scene 7 is the untouched Contact section with the deco frame echo.

- [ ] **Step 3: Confirm nav behavior**

At desktop width: click Home/Story/Work and confirm they scroll to `#scene-1`/`#scene-3`/`#scene-5`. Resize under 860px: confirm the desktop links hide, the hamburger appears, clicking it opens the fullscreen glass menu with the three links staggering in, clicking a link both navigates and closes the menu, clicking the backdrop closes it without navigating.

- [ ] **Step 4: Confirm Hero and Contact visuals**

Zoom into the nameplate and Contact panel corners: confirm the Art Deco frame (nested rectangle + corner notches + corner diagonals) renders correctly in both, and that hovering the hero name still triggers the VariableProximity weight/optical-size effect.

- [ ] **Step 5: Confirm both languages**

Toggle EN/中 and re-check nav labels, scene placeholder text, hero badge/stats, and that layout doesn't break in either language.

- [ ] **Step 6: Check console and network**

Confirm no console errors and no failed network requests, and that the two new WebP assets load (check the network panel for `hero-background.webp` / `tree-day.webp` with reasonable transfer sizes, not the original multi-MB PNGs).

- [ ] **Step 7: Final commit if any fixes were needed**

If Steps 2–6 turned up any visual bugs, fix them, re-run `npm test`, and commit:

```bash
git add -A
git commit -m "fix: address visual issues found in Batch 1 browser verification"
```

If nothing needed fixing, no commit is needed for this task.

---

## Plan Self-Review

- **Spec coverage:** Architecture (Task 11's continuous scroll + reused `RevealSection`/motion pattern), Global changes (Nav → Task 7, FramedPanel → Task 5, Asset pipeline → Task 2), Scene 1 Hero (Task 8), Scenes 0/2/3/4/6 skeleton incl. the corrected background-availability note (Tasks 4 + 11), Scene 5 reuse (Task 10), Scene 7 (Task 9), Testing/verification section (Task 12) — every spec section has a task.
- **Placeholder scan:** no "TBD"/"handle errors appropriately"-style steps; every step has real code or a real command with expected output.
- **Type/name consistency checked:** `SceneSkeleton({ id, title, note, backgroundUrl })` props match every call site in Task 11; `MobileMenu({ open, links, onClose })` matches Task 7's usage; `content.en.scenes.sceneN.{title,note}` matches both Task 3's data shape and Task 11's `scenes.sceneN.title/.note` reads; `FramedPanel variant="deco"` matches Task 5's CrackTexture branch name (`crack-texture--deco`) and Task 8/9's usage.
