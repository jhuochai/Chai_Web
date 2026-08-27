# Career Record and Game Bloom Panels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the CSS-like career/game detail panels with one centered industrial inspection dock, add individually colored work ribbons and game flowers, and add Ready or Not as the twelfth game.

**Architecture:** Keep the existing day/night tree backgrounds and camera controller. Add a static visual manifest for per-item artwork, a reusable `InspectionDock` presentation component for both dialogs, and preserve the existing portal, focus, media, and camera-state behavior in `CareerRibbonSheet` and `GameBloom`. Generated artwork remains layered and text-free so React owns all content and accessibility.

**Tech Stack:** React 19, Vite 8, Motion 12, Vitest, Testing Library, CSS, WebP raster assets generated through ImageGen.

## Global Constraints

- The tree backgrounds remain `career-tree-day-factory-clean-v3.webp` and `career-tree-night-factory-clean-v2.webp`.
- The dock is centered at 62–68% viewport width and occupies about 35–40% of the lower viewport.
- At least about 60% of the tree scene remains visible while a detail panel is open.
- No baked-in text, glass cards, thin HUD frames, floating rounded cards, or pure-black full-screen cover.
- All four ribbons share one construction and all twelve flowers share one silhouette/material system.
- Closing a detail panel preserves camera progress and day/night mode and returns focus to its trigger.
- `prefers-reduced-motion` removes lift, drift, breathing, and flashing motion.
- Keep Traditional Chinese and English content aligned.
- Do not push GitHub or deploy Cloudflare.

---

## File Structure

- Create `src/data/careerVisuals.js`: static imports and item-to-art/palette mappings.
- Create `src/data/careerVisuals.test.js`: mapping completeness and uniqueness tests.
- Create `src/components/InspectionDock.jsx`: reusable physical dock markup.
- Create `src/components/InspectionDock.css`: centered apparatus layout, material layers, responsive behavior, and reduced motion.
- Modify `src/data/content.js`: add Ready or Not in both languages and the legacy player list.
- Modify `src/data/content.test.js`: expect twelve aligned games.
- Modify `src/components/CareerTree.jsx`: use per-item visual assets and add the twelfth hotspot.
- Modify `src/components/CareerTree.test.jsx`: verify unique visuals, twelve non-overlapping flower hotspots, and preserved camera state.
- Modify `src/components/CareerRibbonSheet.jsx` and `.css`: render the shared career dock.
- Modify `src/components/CareerRibbonSheet.test.jsx`: verify dock mode, artwork, accessibility, and dismissal.
- Modify `src/components/GameBloom.jsx` and `.css`: render the shared bloom dock while preserving lazy media.
- Modify `src/components/GameBloom.test.jsx`: verify bloom dock, media fallbacks, and focus behavior.
- Create assets under `src/assets/scenes/inspection-dock/`, `src/assets/scenes/ribbons/`, and `src/assets/scenes/blooms/`.

---

### Task 1: Add the twelfth game contract

**Files:**
- Modify: `src/data/content.js`
- Modify: `src/data/content.test.js`

**Interfaces:**
- Produces: `content.en.careerTree.flowers` and `content.zh.careerTree.flowers` with identical twelve IDs ending in `ready-or-not`.
- Produces: aligned `portfolio.player.games` lists containing the same twelve display names.

- [ ] **Step 1: Update the content tests to require twelve games**

```js
const expectedIds = [
  'wild-rift', 'identity-v', 'stardew', 'lol', 'valorant', 'r6', 'gta5',
  'minecraft', 'palworld', 'dont-starve', 'raft', 'ready-or-not',
];

expect(content[lang].careerTree.flowers).toHaveLength(12);
expect(new Set(content[lang].careerTree.flowers.map((game) => game.id)).size).toBe(12);
```

Add exact display-name expectations:

```js
['ready-or-not', 'Ready or Not']
```

- [ ] **Step 2: Run the focused content tests and verify failure**

Run: `npm test -- src/data/content.test.js`

Expected: FAIL because both language arrays still contain eleven games.

- [ ] **Step 3: Add bilingual Ready or Not content**

Append to both `careerTree.flowers` arrays:

```js
// English
{
  id: 'ready-or-not',
  name: 'Ready or Not',
  desc: 'A slow, high-pressure room clear where one missed detail can change the whole plan.',
},

// Traditional Chinese
{
  id: 'ready-or-not',
  name: 'Ready or Not',
  desc: '慢速但高壓的室內攻堅；一個漏掉的細節，就可能讓整個計畫必須重排。',
},
```

Append `{ name: 'Ready or Not' }` to both legacy `portfolio.player.games` arrays.

- [ ] **Step 4: Run the focused test and verify success**

Run: `npm test -- src/data/content.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/content.js src/data/content.test.js
git commit -m "feat: add Ready or Not to route tree"
```

---

### Task 2: Generate and approve the layered artwork

**Files:**
- Create: `src/assets/scenes/inspection-dock/dock-base-v1.webp`
- Create: `src/assets/scenes/inspection-dock/dock-career-attachment-v1.webp`
- Create: `src/assets/scenes/inspection-dock/dock-bloom-attachment-v1.webp`
- Create: `src/assets/scenes/ribbons/ribbon-gamesofa-v1.webp`
- Create: `src/assets/scenes/ribbons/ribbon-ntpu-v1.webp`
- Create: `src/assets/scenes/ribbons/ribbon-actg-v1.webp`
- Create: `src/assets/scenes/ribbons/ribbon-eelin-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-wild-rift-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-identity-v-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-stardew-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-lol-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-valorant-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-r6-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-gta5-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-minecraft-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-palworld-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-dont-starve-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-raft-v1.webp`
- Create: `src/assets/scenes/blooms/bloom-ready-or-not-v1.webp`

**Interfaces:**
- Produces: transparent-background WebP layers with no text and consistent lighting.
- Consumes: approved day/night tree backgrounds and the design spec palette.

- [ ] **Step 1: Generate one centered combined dock preview**

Use the existing day and night tree art as visual references. The prompt must include:

```text
Centered industrial inspection console rising from the lower edge, Arcane-inspired painterly 2D art with believable 3D lighting, blackened steel and worn antique brass, symmetrical silhouette, mild perspective tilt, apparatus width about 65 percent of frame, lower 38 percent of frame only, tree remains visible behind, no person, no text, no HUD, no glass card, no floating panel. Show two compatible modes side by side as a design sheet: ribbon archive clamps and botanical flower observation cradle. Transparent separable apparatus layers.
```

Present this preview to the user before generating the complete asset set.

- [ ] **Step 2: Generate and approve one ribbon and two flower calibration samples**

Generate:

- Gamesofa ribbon: deep indigo, electric cyan-violet reflection, aged gold thread edge.
- Minecraft flower: soil brown to grass green, tiny stone-gray core detail.
- Ready or Not flower: black petals, warning-red veins, minimal cold police-blue core.

All samples must be isolated on transparent backgrounds, have no labels, and follow one shared silhouette/material family.

- [ ] **Step 3: Generate the remaining item assets only after calibration approval**

Use the exact palettes in the design spec. Keep source PNGs if ImageGen returns PNG, then export optimized WebP with alpha. Do not upscale beyond what the website needs.

- [ ] **Step 4: Validate every raster asset**

Run a Sharp-based inspection script or one-off Node command that prints width, height, format, alpha presence, and file size for all nineteen assets.

Expected:

- Every layer is WebP.
- Every ribbon and flower has alpha.
- No file exceeds 4 MB.
- All flowers use matching canvas dimensions.
- All ribbons use matching canvas dimensions.

- [ ] **Step 5: Commit**

```bash
git add src/assets/scenes/inspection-dock src/assets/scenes/ribbons src/assets/scenes/blooms
git commit -m "assets: add route tree inspection artwork"
```

---

### Task 3: Add the visual manifest

**Files:**
- Create: `src/data/careerVisuals.js`
- Create: `src/data/careerVisuals.test.js`

**Interfaces:**
- Produces: `CAREER_RIBBON_VISUALS`, `GAME_BLOOM_VISUALS`, and `getCareerVisual(kind, id)`.
- `getCareerVisual('ribbon' | 'bloom', string)` returns `{ src, accent, glow }` or throws for an unknown ID.

- [ ] **Step 1: Write the failing manifest tests**

```js
import { describe, expect, it } from 'vitest';
import { content } from './content';
import { CAREER_RIBBON_VISUALS, GAME_BLOOM_VISUALS, getCareerVisual } from './careerVisuals';

describe('career visuals', () => {
  it('maps every bilingual career and game id', () => {
    expect(Object.keys(CAREER_RIBBON_VISUALS)).toEqual(
      content.en.careerTree.ribbons.map(({ id }) => id)
    );
    expect(Object.keys(GAME_BLOOM_VISUALS)).toEqual(
      content.en.careerTree.flowers.map(({ id }) => id)
    );
  });

  it('uses a distinct asset for every item', () => {
    const sources = [...Object.values(CAREER_RIBBON_VISUALS), ...Object.values(GAME_BLOOM_VISUALS)]
      .map(({ src }) => src);
    expect(new Set(sources).size).toBe(sources.length);
  });

  it('fails loudly for an unknown visual', () => {
    expect(() => getCareerVisual('bloom', 'missing')).toThrow(/missing/);
  });
});
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- src/data/careerVisuals.test.js`

Expected: FAIL because `careerVisuals.js` does not exist.

- [ ] **Step 3: Implement the static manifest**

```js
import ribbonGamesofa from '../assets/scenes/ribbons/ribbon-gamesofa-v1.webp';
import ribbonNtpu from '../assets/scenes/ribbons/ribbon-ntpu-v1.webp';
import ribbonActg from '../assets/scenes/ribbons/ribbon-actg-v1.webp';
import ribbonEelin from '../assets/scenes/ribbons/ribbon-eelin-v1.webp';
import bloomWildRift from '../assets/scenes/blooms/bloom-wild-rift-v1.webp';
import bloomIdentityV from '../assets/scenes/blooms/bloom-identity-v-v1.webp';
import bloomStardew from '../assets/scenes/blooms/bloom-stardew-v1.webp';
import bloomLol from '../assets/scenes/blooms/bloom-lol-v1.webp';
import bloomValorant from '../assets/scenes/blooms/bloom-valorant-v1.webp';
import bloomR6 from '../assets/scenes/blooms/bloom-r6-v1.webp';
import bloomGta5 from '../assets/scenes/blooms/bloom-gta5-v1.webp';
import bloomMinecraft from '../assets/scenes/blooms/bloom-minecraft-v1.webp';
import bloomPalworld from '../assets/scenes/blooms/bloom-palworld-v1.webp';
import bloomDontStarve from '../assets/scenes/blooms/bloom-dont-starve-v1.webp';
import bloomRaft from '../assets/scenes/blooms/bloom-raft-v1.webp';
import bloomReadyOrNot from '../assets/scenes/blooms/bloom-ready-or-not-v1.webp';

export const CAREER_RIBBON_VISUALS = {
  gamesofa: { src: ribbonGamesofa, accent: '#45c7db', glow: 'rgba(69, 199, 219, .34)' },
  ntpu: { src: ribbonNtpu, accent: '#d8c9a2', glow: 'rgba(216, 201, 162, .24)' },
  actg: { src: ribbonActg, accent: '#75c7ad', glow: 'rgba(117, 199, 173, .28)' },
  eelin: { src: ribbonEelin, accent: '#c48ba6', glow: 'rgba(196, 139, 166, .28)' },
};

export const GAME_BLOOM_VISUALS = {
  'wild-rift': { src: bloomWildRift, accent: '#51c6ba', glow: 'rgba(81, 198, 186, .34)' },
  'identity-v': { src: bloomIdentityV, accent: '#8f3f4a', glow: 'rgba(143, 63, 74, .3)' },
  stardew: { src: bloomStardew, accent: '#b7c766', glow: 'rgba(183, 199, 102, .3)' },
  lol: { src: bloomLol, accent: '#c7a65e', glow: 'rgba(199, 166, 94, .3)' },
  valorant: { src: bloomValorant, accent: '#df4c47', glow: 'rgba(223, 76, 71, .3)' },
  r6: { src: bloomR6, accent: '#d59b3c', glow: 'rgba(213, 155, 60, .28)' },
  gta5: { src: bloomGta5, accent: '#b56bb6', glow: 'rgba(181, 107, 182, .3)' },
  minecraft: { src: bloomMinecraft, accent: '#6d9f4d', glow: 'rgba(109, 159, 77, .3)' },
  palworld: { src: bloomPalworld, accent: '#64c7cf', glow: 'rgba(100, 199, 207, .3)' },
  'dont-starve': { src: bloomDontStarve, accent: '#c8bca7', glow: 'rgba(200, 188, 167, .24)' },
  raft: { src: bloomRaft, accent: '#4faeba', glow: 'rgba(79, 174, 186, .3)' },
  'ready-or-not': { src: bloomReadyOrNot, accent: '#d94141', glow: 'rgba(217, 65, 65, .3)' },
};

export function getCareerVisual(kind, id) {
  const map = kind === 'ribbon' ? CAREER_RIBBON_VISUALS : GAME_BLOOM_VISUALS;
  const visual = map[id];
  if (!visual) throw new Error(`Missing ${kind} visual: ${id}`);
  return visual;
}
```

- [ ] **Step 4: Run the focused test and verify success**

Run: `npm test -- src/data/careerVisuals.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/careerVisuals.js src/data/careerVisuals.test.js
git commit -m "feat: map route tree visual identities"
```

---

### Task 4: Render distinct ribbons and twelve correctly scaled flowers

**Files:**
- Modify: `src/components/CareerTree.jsx`
- Modify: `src/components/CareerTree.test.jsx`
- Modify: `src/components/CareerTree.css`
- Modify: `src/components/GameBloom.css`

**Interfaces:**
- Consumes: `getCareerVisual(kind, id)` from Task 3.
- Produces: twelve non-overlapping flower triggers and four distinct ribbon triggers on the existing camera scale.

- [ ] **Step 1: Update the tree tests first**

Replace the retired same-asset assertions with:

```js
expect(blooms).toHaveLength(12);
expect(new Set(blooms.map((node) => node.dataset.asset)).size).toBe(12);

const ribbonSources = screen.getAllByTestId('career-ribbon-asset')
  .map((image) => image.getAttribute('src'));
expect(new Set(ribbonSources).size).toBe(4);
```

Keep the existing overlap, smaller-than-lamp, keyboard, camera progress, and focus-return tests. Update their expected counts from eleven to twelve.

- [ ] **Step 2: Run the tree tests and verify failure**

Run: `npm test -- src/components/CareerTree.test.jsx`

Expected: FAIL because one shared ribbon and one shared bloom asset are still used.

- [ ] **Step 3: Add Ready or Not to the hotspot layout**

Add an anchor chosen through the existing overlap calculation:

```js
'ready-or-not': {
  left: '69.2%', top: '58.8%', mobileLeft: '82%', mobileTop: '69%',
  size: 'sm', branch: 'lower-right', rotation: '-4deg',
},
```

If the automated overlap test fails at any supported viewport, adjust only this entry until all tested bounds are separate and the flower stays below the navigation zone.

- [ ] **Step 4: Use the visual manifest in both render branches**

```jsx
const visual = getCareerVisual('bloom', item.id);
<GameBloom asset={visual.src} accent={visual.accent} glow={visual.glow} />
```

```jsx
const visual = getCareerVisual('ribbon', item.id);
<button style={{ ...spots[item.id], '--item-accent': visual.accent, '--item-glow': visual.glow }}>
  <img src={visual.src} alt="" data-testid="career-ribbon-asset" />
</button>
```

- [ ] **Step 5: Tie visual size to camera progress without changing hit targets**

Use the existing `--camera-progress` custom property to keep far-state artwork smaller while leaving each 52px minimum button accessible. Do not introduce a second zoom controller.

- [ ] **Step 6: Run the focused tests**

Run: `npm test -- src/components/CareerTree.test.jsx src/data/careerVisuals.test.js`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/CareerTree.jsx src/components/CareerTree.css src/components/GameBloom.css src/components/CareerTree.test.jsx
git commit -m "feat: color-code route tree items"
```

---

### Task 5: Build the centered reusable inspection dock

**Files:**
- Create: `src/components/InspectionDock.jsx`
- Create: `src/components/InspectionDock.css`
- Create: `src/components/InspectionDock.test.jsx`

**Interfaces:**
- Consumes props: `{ mode: 'career' | 'game', accent: string, glow: string, specimenSrc?: string, children: ReactNode }`.
- Produces: one centered `.inspection-dock` apparatus with a content region and optional specimen region.

- [ ] **Step 1: Write the failing component tests**

```jsx
render(
  <InspectionDock mode="game" accent="#d94141" glow="rgba(217,65,65,.3)" specimenSrc="/flower.webp">
    <h3>Ready or Not</h3>
  </InspectionDock>
);
expect(screen.getByTestId('inspection-dock')).toHaveAttribute('data-mode', 'game');
expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('src', '/flower.webp');
expect(screen.getByText('Ready or Not')).toBeInTheDocument();
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- src/components/InspectionDock.test.jsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement focused structural markup**

```jsx
export default function InspectionDock({ mode, accent, glow, specimenSrc, children }) {
  return (
    <div
      className={`inspection-dock inspection-dock--${mode}`}
      data-testid="inspection-dock"
      data-mode={mode}
      style={{ '--dock-accent': accent, '--dock-glow': glow }}
    >
      <img className="inspection-dock__base" src={dockBase} alt="" aria-hidden="true" />
      <img className="inspection-dock__attachment" src={mode === 'career' ? dockCareer : dockBloom} alt="" aria-hidden="true" />
      {specimenSrc && <img className="inspection-dock__specimen" src={specimenSrc} alt="" aria-hidden="true" />}
      <div className="inspection-dock__content">{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: Implement the centered layout**

Required CSS assertions:

```css
.inspection-dock {
  position: relative;
  width: min(66vw, 1080px);
  min-width: min(92vw, 680px);
  max-height: 40dvh;
  margin-inline: auto;
  transform-origin: 50% 100%;
}

@media (max-width: 720px) {
  .inspection-dock {
    width: 100%;
    min-width: 0;
    max-height: 78dvh;
  }
}
```

Use the generated base and attachment images as structural layers. Keep interactive HTML above them and ensure content scrolls inside the metal reading surface.

- [ ] **Step 5: Add reduced-motion behavior**

```css
@media (prefers-reduced-motion: reduce) {
  .inspection-dock,
  .inspection-dock__specimen {
    animation: none;
    transition: none;
  }
}
```

- [ ] **Step 6: Run the focused test and verify success**

Run: `npm test -- src/components/InspectionDock.test.jsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/InspectionDock.jsx src/components/InspectionDock.css src/components/InspectionDock.test.jsx
git commit -m "feat: add centered inspection dock"
```

---

### Task 6: Move work details into the career dock

**Files:**
- Modify: `src/components/CareerRibbonSheet.jsx`
- Modify: `src/components/CareerRibbonSheet.css`
- Modify: `src/components/CareerRibbonSheet.test.jsx`

**Interfaces:**
- Consumes: `InspectionDock`, `getCareerVisual('ribbon', item.id)`.
- Preserves: `open`, `onClose`, `triggerRef`, Escape dismissal, backdrop dismissal, focus trap, scroll lock, and focus return.

- [ ] **Step 1: Extend the existing tests**

```js
expect(screen.getByTestId('inspection-dock')).toHaveAttribute('data-mode', 'career');
expect(screen.getByTestId('career-ribbon-backdrop')).toHaveAttribute('data-tree-visible', 'true');
expect(dialog).not.toHaveClass('framed-panel');
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- src/components/CareerRibbonSheet.test.jsx`

Expected: FAIL because the shared dock is not rendered.

- [ ] **Step 3: Wrap the existing content in `InspectionDock`**

```jsx
const visual = getCareerVisual('ribbon', item.id);

<motion.article className="career-ribbon-sheet__panel" role="dialog" aria-modal="true" aria-label={item.org}>
  <InspectionDock mode="career" accent={visual.accent} glow={visual.glow} specimenSrc={visual.src}>
    <div className="career-ribbon-sheet__content">
      <p className="career-ribbon-sheet__period">{item.period}</p>
      <h3>{item.org}</h3>
      <p className="career-ribbon-sheet__role">{item.role}</p>
      <p className="career-ribbon-sheet__summary">{item.summary}</p>
      <ul className="career-ribbon-sheet__points">
        {item.points.map((point) => <li key={point}>{point}</li>)}
      </ul>
    </div>
  </InspectionDock>
</motion.article>
```

Set the backdrop to a restrained translucent scene dimmer instead of blur or near-black fill:

```css
.career-ribbon-sheet { background: rgba(3, 7, 12, 0.28); }
```

- [ ] **Step 4: Run the focused tests and verify success**

Run: `npm test -- src/components/CareerRibbonSheet.test.jsx src/components/CareerTree.test.jsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/CareerRibbonSheet.jsx src/components/CareerRibbonSheet.css src/components/CareerRibbonSheet.test.jsx
git commit -m "feat: present work records on inspection dock"
```

---

### Task 7: Move game details and media into the bloom dock

**Files:**
- Modify: `src/components/GameBloom.jsx`
- Modify: `src/components/GameBloom.css`
- Modify: `src/components/GameBloom.test.jsx`

**Interfaces:**
- Consumes: `InspectionDock`, `accent`, `glow`, and the per-game flower asset.
- Preserves: lazy video creation, poster fallback, reduced-motion poster-only behavior, focus trap, Escape dismissal, and focus return.

- [ ] **Step 1: Extend the existing game tests**

Add props to the harness:

```jsx
accent="#d94141"
glow="rgba(217,65,65,.3)"
```

Add assertions:

```js
expect(screen.getByTestId('inspection-dock')).toHaveAttribute('data-mode', 'game');
expect(screen.getByTestId('game-bloom-backdrop')).toHaveAttribute('data-tree-visible', 'true');
expect(screen.getByText(baseGame.desc)).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- src/components/GameBloom.test.jsx`

Expected: FAIL because the game dialog still renders its independent CSS sheet.

- [ ] **Step 3: Replace the sheet layout with `InspectionDock`**

```jsx
<motion.article className="game-bloom__sheet" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
  <InspectionDock mode="game" accent={accent} glow={glow} specimenSrc={asset}>
    <div className="game-bloom__copy">
      {game.note && <p className="game-bloom__note">{game.note}</p>}
      <h3 id={titleId}>{game.name}</h3>
      <p id={descriptionId} className="game-bloom__description">{game.desc}</p>
      <div className="game-bloom__media">
        {game.video && !reduce && !videoFailed ? (
          videoLoaded ? (
            <video ref={videoRef} src={game.video} poster={game.poster} preload="none" muted playsInline controls data-game-media onError={() => setVideoFailed(true)} />
          ) : (
            <button type="button" className="game-bloom__play" onClick={() => setVideoLoaded(true)} style={game.poster ? { backgroundImage: `url(${game.poster})` } : undefined} aria-label={copy.play}>
              <Play size={22} weight="fill" aria-hidden="true" />
              <span>{copy.play}</span>
            </button>
          )
        ) : game.poster && !posterFailed ? (
          <img src={game.poster} alt="" loading="lazy" onError={() => setPosterFailed(true)} />
        ) : (
          <p className="game-bloom__media-future">{copy.mediaFuture}</p>
        )}
      </div>
    </div>
  </InspectionDock>
</motion.article>
```

Keep all existing video state and fallback branches unchanged inside the dock content.

- [ ] **Step 4: Remove the old glass/card visual CSS**

Delete the old sheet radial gradients, `backdrop-filter`, decorative glass circle, and independent portrait panel. Retain only layout rules needed for copy, media, close control, and the tree-visible dimmer.

- [ ] **Step 5: Run the focused tests and verify success**

Run: `npm test -- src/components/GameBloom.test.jsx src/components/CareerTree.test.jsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/GameBloom.jsx src/components/GameBloom.css src/components/GameBloom.test.jsx
git commit -m "feat: present game records on bloom inspection dock"
```

---

### Task 8: Responsive, accessibility, and visual verification

**Files:**
- Modify: `src/components/InspectionDock.css`
- Modify: `src/components/CareerTree.css`
- Modify: `src/components/CareerRibbonSheet.css`
- Modify: `src/components/GameBloom.css`
- Modify: `src/components/CareerTree.test.jsx`
- Modify: `src/components/InspectionDock.test.jsx`
- Modify: `src/components/CareerRibbonSheet.test.jsx`
- Modify: `src/components/GameBloom.test.jsx`

**Interfaces:**
- Produces: verified desktop and mobile route-tree experience.

- [ ] **Step 1: Run all automated checks**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all tests pass, lint exits 0, and Vite production build exits 0.

- [ ] **Step 2: Inspect desktop states in the real browser**

At 1280×720, verify:

- Day far state: four ribbons visible and smaller with distance.
- Day near state: each ribbon opens the centered career dock.
- Night far state: twelve flowers stay smaller than the hanging lamp.
- Night near state: each flower opens the centered bloom dock.
- Tree remains visibly present behind both docks.
- Closing keeps the same camera progress and mode.
- Video buttons, posters, and fallbacks remain usable.

- [ ] **Step 3: Inspect narrow and mobile states**

Verify at 795×698, 644×698, 390×844, and 360×800:

- No flower hit areas overlap.
- Dock remains horizontally centered.
- Close control is visible and keyboard reachable.
- Long Traditional Chinese lines do not collide or overflow.
- Content scrolls inside the apparatus rather than expanding beyond the viewport.

- [ ] **Step 4: Verify reduced motion**

Enable reduced motion and confirm:

- Dock appears with a short crossfade only.
- No ribbon drift, flower breathing, lift, or flashing remains.
- Game video does not autoplay; poster is used.

- [ ] **Step 5: Commit final adjustments**

```bash
git add src
git commit -m "fix: polish route tree inspection experience"
```

- [ ] **Step 6: Report completion without deployment**

Report the local URL, changed asset paths, test/build results, and any remaining content/media that the user must supply. Do not push or deploy.
