# Portfolio Cohesion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current scene-based portfolio into one continuous Arcane-Baroque industrial journey, with a larger click-targeted Loading fire effect, an open Intro, cohesive Hero/Career imagery, and a real cat-café featured case.

**Architecture:** Keep the existing React/Vite single-page scene structure and `motion/react` interactions. Add one shared scene-atmosphere layer, isolate Loading particle math into a testable pure module, add a dedicated cat-café case component/data module, and replace generated imagery only after preview approval. Existing components remain independently testable and no backend is introduced.

**Tech Stack:** React 19, Vite 8, Lenis, GSAP/ScrollTrigger, `@gsap/react`, motion/react, Canvas 2D, CSS, Vitest, Testing Library, Sharp for local image optimization, ImageGen for Hero/Career artwork.

## Global Constraints

- Approved choices are 1A–9A.
- Hero uses a brighter Arcane × Baroque ruined factory: broken conveyors, steel beams, shattered roofs, gears/boilers, distant city or furnace light; no classical colonnade, desert, or wasteland.
- Shared background means one lighting/material system with section-specific variation, not one repeated image.
- Intro loses the full decorative frame; the hanging character must be physically anchored to the Hero edge.
- Loading fire is white-gold/orange with limited cyan/violet Arcane energy and must burst at the actual pointer/touch position.
- Loading keeps a three-second auto-fire fallback and keyboard/reduced-motion paths.
- Lenis is the only smooth-scroll engine; GSAP owns only Hero→Intro and Career Tree scroll choreography; motion/react remains for discrete UI state transitions.
- Cat-café social assets remain unaltered; absolute metrics are used where engagement-rate denominators conflict.
- No random Picsum imagery, CMS, backend, analytics expansion, or regenerated social posts.
- Verify at 360×800, 768×1024, 910×698, and 1440×900.

## File Map

- Create `src/components/loadingFire.js`: pure particle/viewport helpers.
- Create `src/components/loadingFire.test.js`: deterministic unit tests for fire origin, palette, and bounds.
- Modify `src/components/LoadingScreen.jsx`, `LoadingScreen.css`, `LoadingScreen.test.jsx`: larger composition and layered impact.
- Modify `src/App.jsx`, `src/index.css`: scene order and shared atmospheric background.
- Create `src/components/SmoothScroll.jsx`, `SmoothScroll.test.jsx`: Lenis lifecycle, GSAP ticker synchronization, and scroll fallback.
- Create `src/lib/scrollToScene.js`, `scrollToScene.test.js`: one navigation interface for Hero/buttons and anchor fallback.
- Modify `src/components/Intro.jsx`, `Intro.css`, `Intro.test.jsx`: open layout and Hero-anchored character.
- Create `src/data/catCafeCase.js`: bilingual case facts and asset metadata.
- Create `src/components/CatCafeCase.jsx`, `CatCafeCase.css`, `CatCafeCase.test.jsx`: featured case.
- Modify `src/components/Portfolio.jsx`, `Portfolio.css`, `Portfolio.test.jsx`: remove random gallery and present compact real cases.
- Modify `src/components/Interests.jsx`, `Interests.css`, `BuildStory.jsx`, `BuildStory.css`: compact supporting chapters.
- Modify `src/components/Hero.jsx`, `Hero.css`, `CareerTree.jsx`, `CareerTree.css` only after generated previews are approved.
- Add optimized images under `src/assets/scenes/` and `src/assets/cases/cat-cafe/`.

---

### Task 1: Testable Loading Fire Engine

**Files:**
- Create: `src/components/loadingFire.js`
- Create: `src/components/loadingFire.test.js`

**Interfaces:**
- Produces: `createFireParticles({ x, y, random })`, `getCanvasMetrics(width, height, dpr)`, and `getAutoTarget(width, height)`.
- Consumed by: `LoadingScreen.jsx` in Task 2.

- [ ] **Step 1: Write the failing unit tests**

```js
import { describe, expect, it } from 'vitest';
import { createFireParticles, getAutoTarget, getCanvasMetrics } from './loadingFire';

describe('loading fire helpers', () => {
  it('creates every particle at the requested impact point', () => {
    const particles = createFireParticles({ x: 321, y: 222, random: () => 0.5 });
    expect(particles.length).toBeGreaterThan(80);
    expect(particles.every((particle) => particle.x === 321 && particle.y === 222)).toBe(true);
    expect(new Set(particles.map((particle) => particle.kind))).toEqual(
      new Set(['core', 'spark', 'ember', 'arcane'])
    );
  });

  it('caps the backing-store density without changing CSS coordinates', () => {
    expect(getCanvasMetrics(910, 698, 3)).toEqual({ cssWidth: 910, cssHeight: 698, dpr: 2 });
  });

  it('places automatic fire in an unobstructed right-side region', () => {
    expect(getAutoTarget(1000, 800)).toEqual({ x: 680, y: 336 });
  });
});
```

- [ ] **Step 2: Run the unit test and verify it fails**

Run: `npm test -- src/components/loadingFire.test.js`  
Expected: FAIL because `loadingFire.js` does not exist.

- [ ] **Step 3: Implement deterministic helpers**

```js
export const FIRE_PALETTE = {
  core: ['#fff9e8', '#ffe1a3'],
  spark: ['#ffc56b', '#ff8b42', '#e0bc6a'],
  ember: ['#ff6b32', '#c94f37'],
  arcane: ['#59d6df', '#8c7de8'],
};

export function getCanvasMetrics(width, height, requestedDpr = 1) {
  return { cssWidth: width, cssHeight: height, dpr: Math.min(Math.max(requestedDpr, 1), 2) };
}

export function getAutoTarget(width, height) {
  return { x: Math.round(width * 0.68), y: Math.round(height * 0.42) };
}

export function createFireParticles({ x, y, random = Math.random }) {
  const make = (kind, count, speedMin, speedMax) =>
    Array.from({ length: count }, (_, index) => {
      const angle = random() * Math.PI * 2;
      const speed = speedMin + random() * (speedMax - speedMin);
      const colors = FIRE_PALETTE[kind];
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

  return [
    ...make('core', 10, 0.4, 2.2),
    ...make('spark', 52, 4.5, 12),
    ...make('ember', 34, 2, 7),
    ...make('arcane', 12, 2.5, 8),
  ];
}
```

- [ ] **Step 4: Run the unit test and verify it passes**

Run: `npm test -- src/components/loadingFire.test.js`  
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/loadingFire.js src/components/loadingFire.test.js
git commit -m "test: define loading fire particle model"
```

### Task 2: Loading Composition and Exact Impact

**Files:**
- Modify: `src/components/LoadingScreen.jsx`
- Modify: `src/components/LoadingScreen.css`
- Modify: `src/components/LoadingScreen.test.jsx`
- Create: `src/assets/scenes/gun-hand-cropped.webp`

**Interfaces:**
- Consumes: helpers from `loadingFire.js`.
- Produces: existing `LoadingScreen({ onDone })` contract unchanged.

- [ ] **Step 1: Extend interaction tests**

```js
it('records the first pointer location as the impact origin', () => {
  renderLoading();
  const overlay = screen.getByRole('button', { name: 'Enter the site' });
  fireEvent.pointerDown(overlay, { clientX: 700, clientY: 300 });
  expect(overlay).toHaveStyle({ '--impact-x': '700px', '--impact-y': '300px' });
});
```

- [ ] **Step 2: Run the component test and verify it fails**

Run: `npm test -- src/components/LoadingScreen.test.jsx`  
Expected: FAIL because `pointerDown` does not set impact CSS variables.

- [ ] **Step 3: Crop the transparent asset with Sharp**

Run: `node scripts/optimize-assets.mjs --input src/assets/scenes/gun-hand.webp --output src/assets/scenes/gun-hand-cropped.webp --trim --width 1400 --quality 88`  
Expected: cropped WebP exists and visible bounds fill the output canvas. If the script lacks these flags, extend the existing script with `sharp(input).trim().resize({ width, withoutEnlargement: true }).webp({ quality })` before running it.

- [ ] **Step 4: Replace click timing and canvas drawing**

Use `onPointerDown={handlePointerDown}` for immediate capture, write `--impact-x/y` on `rootRef.current`, call `getCanvasMetrics`, scale the context once, and draw each `kind` differently: white additive core, elongated sparks aligned to velocity, circular embers with gravity, and cyan/violet arcane wisps with lower alpha. Preserve the phase clock and fire-once guard.

- [ ] **Step 5: Scale the visible composition responsively**

```css
.loading-screen__gun {
  left: clamp(-36px, -1.5vw, 18px);
  width: clamp(460px, 52vw, 800px);
}
.loading-screen__flash { width: clamp(108px, 11vw, 170px); height: clamp(108px, 11vw, 170px); }
.loading-screen__bullet { width: clamp(38px, 4vw, 64px); height: clamp(4px, 0.45vw, 7px); }
@media (max-width: 640px) {
  .loading-screen__gun { left: -18vw; width: 86vw; }
}
```

- [ ] **Step 6: Run tests and build**

Run: `npm test -- src/components/loadingFire.test.js src/components/LoadingScreen.test.jsx`  
Expected: all tests PASS.  
Run: `npm run build`  
Expected: Vite build succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/LoadingScreen.jsx src/components/LoadingScreen.css src/components/LoadingScreen.test.jsx src/assets/scenes/gun-hand-cropped.webp scripts/optimize-assets.mjs
git commit -m "feat: enlarge loading shot and anchor fire to input"
```

### Task 3A: Lenis and GSAP Motion Foundation

**Files:**
- Create: `src/components/SmoothScroll.jsx`
- Create: `src/components/SmoothScroll.test.jsx`
- Create: `src/lib/scrollToScene.js`
- Create: `src/lib/scrollToScene.test.js`
- Modify: `src/App.jsx`
- Modify: `src/components/Hero.jsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Produces: `setScrollEngine(engine)` and `scrollToScene(target, options)`.
- Consumed by: `Hero.jsx` and any non-anchor scene navigation.

- [ ] **Step 1: Write failing navigation fallback tests**

```js
import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrollToScene, setScrollEngine } from './scrollToScene';

describe('scrollToScene', () => {
  afterEach(() => setScrollEngine(null));

  it('uses Lenis when the shared engine is ready', () => {
    const engine = { scrollTo: vi.fn() };
    setScrollEngine(engine);
    scrollToScene('#scene-3', { immediate: false });
    expect(engine.scrollTo).toHaveBeenCalledWith('#scene-3', expect.objectContaining({ immediate: false }));
  });

  it('falls back to native scroll when Lenis is unavailable', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'querySelector').mockReturnValue({ scrollIntoView });
    scrollToScene('#scene-3', { immediate: true });
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto' });
  });
});
```

- [ ] **Step 2: Run and verify RED**

Run: `npx.cmd vitest run src/lib/scrollToScene.test.js --pool=forks --maxWorkers=1`  
Expected: FAIL because the module does not exist.

- [ ] **Step 3: Install the approved motion dependencies**

Run: `npm.cmd install lenis gsap @gsap/react`  
Expected: package files contain all three dependencies and install succeeds without audit errors that block runtime.

- [ ] **Step 4: Implement the shared scroll interface**

```js
let scrollEngine = null;

export function setScrollEngine(engine) {
  scrollEngine = engine;
}

export function scrollToScene(target, { immediate = false } = {}) {
  if (scrollEngine) {
    scrollEngine.scrollTo(target, { immediate, duration: immediate ? 0 : 1.05 });
    return;
  }
  document.querySelector(target)?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
}
```

- [ ] **Step 5: Implement one Lenis/GSAP ticker lifecycle**

Create `SmoothScroll` with Lenis `anchors:true`, `respectReducedMotion:true`, `autoRaf:false`, `stopInertiaOnNavigate:true`; subscribe `ScrollTrigger.update`, call `lenis.raf(time * 1000)` from `gsap.ticker`, set the shared engine, and on cleanup remove the ticker callback, destroy Lenis, clear the engine, and kill component-owned triggers.

- [ ] **Step 6: Replace Hero's native `scrollIntoView` call**

Use `scrollToScene(scene.target, { immediate: reduce })`; keep the existing career-tree mode event.

- [ ] **Step 7: Verify and commit**

Run: `npx.cmd vitest run src/lib/scrollToScene.test.js src/components/SmoothScroll.test.jsx src/components/Hero.test.jsx --pool=forks --maxWorkers=1`  
Expected: PASS.

```bash
git add package.json package-lock.json src/App.jsx src/components/SmoothScroll.jsx src/components/SmoothScroll.test.jsx src/components/Hero.jsx src/lib/scrollToScene.js src/lib/scrollToScene.test.js
git commit -m "feat: coordinate smooth scroll and scene choreography"
```

### Task 3B: Shared Atmosphere and Open Intro

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Modify: `src/components/Intro.jsx`
- Modify: `src/components/Intro.css`
- Modify: `src/components/Intro.test.jsx`

**Interfaces:**
- Produces: `<main className="scene-flow">` and the existing `#scene-2` anchor.

- [ ] **Step 1: Add failing structure assertions**

```js
it('renders the introduction without a decorative framed panel', () => {
  renderIntro();
  expect(document.querySelector('.framed-panel')).not.toBeInTheDocument();
  expect(document.querySelector('.intro__copy')).toBeInTheDocument();
  expect(document.querySelector('.intro__character-bridge')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the Intro test and verify it fails**

Run: `npm test -- src/components/Intro.test.jsx`  
Expected: FAIL because the current component uses `FramedPanel` and old class names.

- [ ] **Step 3: Remove the frame and create the bridge composition**

Replace the `FramedPanel` wrapper with a semantic `<div className="intro__copy">`. Keep all bilingual content and trait rows. Rename the character wrapper to `intro__character-bridge`, position it absolute at the top-right of Intro, and align its bar with the lower edge of the Hero window.

- [ ] **Step 4: Add shared atmosphere tokens**

```css
:root {
  --scene-void: #111018;
  --scene-violet: rgba(74, 55, 104, 0.22);
  --scene-cyan: rgba(63, 193, 214, 0.12);
  --scene-gold: rgba(224, 188, 106, 0.14);
}
.scene-flow {
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(80% 45% at 78% 8%, var(--scene-cyan), transparent 70%),
    radial-gradient(70% 55% at 18% 28%, var(--scene-violet), transparent 72%),
    linear-gradient(180deg, #111018 0%, #15121b 38%, #10131a 100%);
}
```

Use section pseudo-elements for fog/light transitions; do not create full bordered cards.

- [ ] **Step 5: Implement responsive character behavior**

At desktop, the character overlaps Hero/Intro on the right without covering the copy. At tablet, reduce to about 220px. Under 640px, crop to a safe top-right fragment or hide with `display:none` if it intersects the name at 360px.

- [ ] **Step 6: Verify**

Run: `npm test -- src/components/Intro.test.jsx src/App.test.jsx`  
Expected: PASS.  
Run: `npm run build`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/index.css src/components/Intro.jsx src/components/Intro.css src/components/Intro.test.jsx
git commit -m "feat: open the intro and connect scene atmosphere"
```

### Task 4: Hero and Career Artwork Preview Pipeline

**Files:**
- Create: `design-previews/hero/hero-factory-a.png`
- Create: `design-previews/hero/hero-factory-b.png`
- Create: `design-previews/career/career-tree-day.png`
- Create: `design-previews/career/career-tree-night.png`
- Modify after approval: `src/components/Hero.jsx`, `src/components/Hero.css`, `src/components/CareerTree.jsx`, `src/components/CareerTree.css`
- Create after approval: optimized WebP assets under `src/assets/scenes/`.

**Interfaces:**
- Hero images must support `object-fit: cover` and leave the bottom center legible.
- Career day/night images must use the same canvas, tree silhouette, and hotspot coordinates.

- [ ] **Step 1: Generate two Hero candidates**

Use ImageGen with the current Hero as a style/composition reference. Candidate A emphasizes readable factory architecture and distant furnace/city glow. Candidate B emphasizes broken roof geometry, hanging conveyors, blue-violet night light, and a stronger warm focal light. Both must exclude columns, colonnades, deserts, barren wasteland, text, logos, and dense meaningless microdetails.

- [ ] **Step 2: Show both Hero candidates for the promised image-only review**

Do not replace the live Hero before the user selects A/B/keep-current.

- [ ] **Step 3: Generate the Career day base**

Create a mechanically plausible central tree in the same industrial world, with clear ribbon and flower zones and restrained background detail.

- [ ] **Step 4: Derive the night version from the selected day image**

Use image editing, not a new independent generation, so silhouette and hotspot geometry remain aligned.

- [ ] **Step 5: Optimize approved assets and integrate**

Resize Hero to a 2400px long edge and Career images to their current display requirements. Export WebP at quality 84–88. Update imports only after approval.

- [ ] **Step 6: Verify scene interactions**

Run: `npm test -- src/components/Hero.test.jsx src/components/CareerTree.test.jsx`  
Expected: scene switching, day/night mode, ribbon hotspots, and flower hotspots PASS.

- [ ] **Step 7: Commit**

```bash
git add design-previews src/assets/scenes src/components/Hero.jsx src/components/Hero.css src/components/CareerTree.jsx src/components/CareerTree.css
git commit -m "feat: align hero and career artwork direction"
```

### Task 5: Acquire and Model Cat-Café Evidence

**Files:**
- Create: `src/assets/cases/cat-cafe/`
- Create: `src/data/catCafeCase.js`

**Interfaces:**
- Produces: `catCafeCase[lang]` with `hero`, `metrics`, and four `pillars`, each containing two assets.

- [ ] **Step 1: Acquire the nine approved assets**

Use the provided Google Drive folder. Preserve original files; for Reels obtain the real cover/poster or video. If access fails, report one complete missing-file list: 三萬粉－2、母親節、世界海洋日、捐款收據、v1.20 版更預告、7 月水果貓、服裝升級攻略、吃啥咪轉盤 Reels、世界幽浮日 Reels.

- [ ] **Step 2: Optimize copies without altering artwork**

Create web copies capped at 1800px long edge, WebP quality 88 for stills. Keep original aspect ratios and do not crop text-bearing artwork.

- [ ] **Step 3: Create bilingual data**

```js
export const catCafeCase = {
  en: {
    title: 'From 18k to 30k: turning a milestone into a community event',
    metrics: [
      ['51,173', 'Impressions'], ['3,898', 'Interactions'],
      ['1,476', 'Comments'], ['383', 'Shares'], ['50', 'Follows'],
    ],
  },
  zh: {
    title: '從 18k 到 30k：把里程碑變成玩家共同參與的社群事件',
    metrics: [
      ['51,173', '曝光'], ['3,898', '互動'],
      ['1,476', '留言'], ['383', '分享'], ['50', '追蹤'],
    ],
  },
};
```

Add the four approved pillars and exact asset paths. Do not store cross-post engagement-rate comparisons.

- [ ] **Step 4: Add a data integrity test**

Assert both languages have five identical metric values, four pillars, two assets per pillar, and nine unique asset paths including the hero.

- [ ] **Step 5: Run and commit**

Run: `npm test -- src/data/catCafeCase.test.js`  
Expected: PASS.

```bash
git add src/assets/cases/cat-cafe src/data/catCafeCase.js src/data/catCafeCase.test.js
git commit -m "feat: add verified cat cafe case evidence"
```

### Task 6: Featured Cat-Café Case and Real Work List

**Files:**
- Create: `src/components/CatCafeCase.jsx`
- Create: `src/components/CatCafeCase.css`
- Create: `src/components/CatCafeCase.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Portfolio.jsx`
- Modify: `src/components/Portfolio.css`
- Modify: `src/components/Portfolio.test.jsx`

**Interfaces:**
- Consumes: `catCafeCase[lang]` from Task 5.
- Produces: `#scene-4` featured case followed by `#scene-5` compact selected work.

- [ ] **Step 1: Write the featured-case test**

```js
it('shows one hero and eight evidence assets grouped into four pillars', () => {
  renderCase();
  expect(screen.getByRole('img', { name: /30k/i })).toBeInTheDocument();
  expect(screen.getAllByTestId('evidence-item')).toHaveLength(8);
  expect(screen.getAllByTestId('evidence-pillar')).toHaveLength(4);
  expect(screen.getByText('1,476')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and verify the test fails**

Run: `npm test -- src/components/CatCafeCase.test.jsx`  
Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement the featured case**

Create a full-width hero visual with adjacent thesis and metrics, followed by an asymmetric CSS grid whose four semantic pillar groups each contain two real assets and short evidence captions. Use `<figure>/<figcaption>` and native video controls or poster links for Reels.

- [ ] **Step 4: Replace CircularGallery/Picsum usage**

Remove the random image source and 3D circular gallery from `Portfolio.jsx`. Present dark-chess testing, KOC partnerships, and ROG Phone 9 as compact rows using real copy; do not invent images.

- [ ] **Step 5: Update scene order**

Render `<CatCafeCase />` immediately after `<CareerTree />`, then `<Portfolio />`, `<Interests />`, and `<BuildStory />`.

- [ ] **Step 6: Verify**

Run: `npm test -- src/components/CatCafeCase.test.jsx src/components/Portfolio.test.jsx src/App.test.jsx`  
Expected: PASS.  
Run: `npm run build`  
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.jsx src/components/CatCafeCase.jsx src/components/CatCafeCase.css src/components/CatCafeCase.test.jsx src/components/Portfolio.jsx src/components/Portfolio.css src/components/Portfolio.test.jsx
git commit -m "feat: feature cat cafe evidence and remove random gallery"
```

### Task 7: Compact Supporting Chapters

**Files:**
- Modify: `src/components/Interests.jsx`
- Modify: `src/components/Interests.css`
- Modify: `src/components/Interests.test.jsx`
- Modify: `src/components/BuildStory.jsx`
- Modify: `src/components/BuildStory.css`
- Modify: `src/components/BuildStory.test.jsx`

**Interfaces:**
- Existing section IDs and bilingual content access remain unchanged.

- [ ] **Step 1: Add density tests**

Assert Interests renders one insight statement and two supporting hobby sources rather than a repeated card grid. Assert Build Story renders a single ordered process and one takeaway without `FramedPanel` nesting.

- [ ] **Step 2: Run and verify failures**

Run: `npm test -- src/components/Interests.test.jsx src/components/BuildStory.test.jsx`  
Expected: at least one new assertion FAILS against the current structure.

- [ ] **Step 3: Refactor Interests**

Use one strong player-insight statement, a compact create/immerse/share loop, and two small hobby sources. Remove redundant framed cards and excessive vertical minimum height while retaining the approved content.

- [ ] **Step 4: Refactor Build Story**

Use one concise method line, five ordered steps with typographic hierarchy, and one AI-collaboration takeaway. Keep it visually subordinate to portfolio evidence.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- src/components/Interests.test.jsx src/components/BuildStory.test.jsx`  
Expected: PASS.

```bash
git add src/components/Interests.jsx src/components/Interests.css src/components/Interests.test.jsx src/components/BuildStory.jsx src/components/BuildStory.css src/components/BuildStory.test.jsx
git commit -m "refactor: compact portfolio supporting chapters"
```

### Task 8: Responsive, Accessibility, and Final Visual QA

**Files:**
- Modify only files implicated by QA findings.

**Interfaces:**
- No new public interface; this task closes the complete approved scope.

- [ ] **Step 1: Run automated verification**

Run: `npm run lint`  
Expected: zero errors.  
Run: `npm test`  
Expected: all tests PASS.  
Run: `npm run build`  
Expected: production build succeeds.

- [ ] **Step 2: Inspect 360×800 and 768×1024**

Confirm Loading target accuracy, no trapped entry, Intro character does not cover text, evidence items remain readable, navigation stays usable, and no horizontal overflow occurs.

- [ ] **Step 3: Inspect 910×698 and 1440×900**

Confirm the enlarged gun has cinematic weight, the right-side hit region remains usable, Hero/Intro overlap reads as one scene, Career hotspots align, and the case hierarchy is obvious within two seconds.

- [ ] **Step 4: Test reduced motion and keyboard paths**

Enable `prefers-reduced-motion: reduce`, activate Loading with Enter and Space, traverse all interactive controls with Tab, and confirm visible focus states.

- [ ] **Step 5: Audit payloads and console**

Ensure no failed image/video requests or console errors. Record optimized asset sizes and keep Hero/Career images at reasonable web payloads.

- [ ] **Step 6: Fix every scoped issue and rerun verification**

Repeat lint, full tests, build, and all four viewport checks until no unresolved scoped finding remains.

- [ ] **Step 7: Commit**

```bash
git add src public
git commit -m "fix: complete responsive portfolio cohesion pass"
```

## Spec Coverage Review

- Loading composition, exact target, hybrid fire, auto fallback, DPR, keyboard, and reduced motion: Tasks 1–2.
- Lenis/GSAP motion foundation and shared Hero/Intro transition: Tasks 3A–3B.
- Brighter ruined-factory Hero with no columns or wasteland: Task 4.
- 2D plus 3D-lit Career Tree with aligned day/night hotspots: Task 4.
- Featured cat-café 1+8 evidence and reliable metrics: Tasks 5–6.
- Removal of random gallery and compact remaining work: Task 6.
- Compact Interests and Build Story: Task 7.
- Responsive, accessibility, performance, and visual QA: Task 8.
