# Hero Cockpit and AI Lab 2.5D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current CSS-only cockpit controls with the approved 2.5D ship scene and add a routable AI lab containing Stapu, the Skills cabinet, and one honest incubation pod.

**Architecture:** Keep the existing station router and chapter transition as the navigation backbone. Split the Hero into state, destination control, and hologram units; add the AI lab as one station that owns its in-scene return control. Copy only optimized website assets into `src/assets` and leave every user source folder untouched.

**Tech Stack:** React 19, Vite 8, Vitest 4, Testing Library, Motion, CSS 2.5D transforms, Sharp for asset verification and conversion.

## Global Constraints

- Work only in `C:/Users/any50/Downloads/履歷網站/.worktrees/chaptered-redesign` on branch `codex/chaptered-redesign`.
- Use `hero page/環繞空間參考圖.png` as the single Hero environment image; do not crossfade to the near variant.
- Keep all source PNG files and the `史達普Stapu寵物` project unchanged.
- Use the formal mapping: handle → `/profile`, joystick → `/career-tree`, knob → `/portfolio`, spherical core → `/ai-lab`.
- Desktop approach is wheel forward/up; touch approach is swipe up; reverse returns to the captain.
- First Hero visit starts far; later Hero visits in the same session start near.
- Mobile controls use horizontal scroll snap and expose about 1.7 controls.
- AI core opens a hologram before traveling to `/ai-lab`.
- No new sound effects and no full 3D/WebGL cockpit.
- All motion has a `prefers-reduced-motion` path.
- Traditional Chinese copy must remain Traditional Chinese and fit its engraved labels.

---

### Task 1: Prepare and verify website assets

**Files:**
- Create: `src/assets/scenes/hero-cockpit-space.webp`
- Create: `src/assets/props/hero-handle.webp`
- Create: `src/assets/props/hero-joystick.webp`
- Create: `src/assets/props/hero-knob.webp`
- Create: `src/assets/props/hero-ai-core.webp`
- Create: `src/assets/props/hero-trash.webp`
- Create: `src/assets/pets/stapu-spritesheet.webp`
- Create: `src/assets/heroAssets.test.js`

**Interfaces:**
- Consumes: the seven approved source images and Stapu's validated 8×11 RGBA spritesheet.
- Produces: importable WebP files with stable filenames; prop files must contain transparency.

- [ ] **Step 1: Write the failing asset contract test**

```js
import { describe, expect, it } from 'vitest';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

const root = join(process.cwd(), 'src', 'assets');
const props = ['hero-handle.webp', 'hero-joystick.webp', 'hero-knob.webp', 'hero-ai-core.webp', 'hero-trash.webp'];

describe('Hero and Stapu asset contract', () => {
  it('ships the cockpit, transparent controls, and validated Stapu sheet', async () => {
    await access(join(root, 'scenes', 'hero-cockpit-space.webp'));
    await access(join(root, 'pets', 'stapu-spritesheet.webp'));
    for (const name of props) {
      const metadata = await sharp(await readFile(join(root, 'props', name))).metadata();
      expect(metadata.hasAlpha).toBe(true);
      expect(metadata.width).toBeGreaterThanOrEqual(700);
    }
    const pet = await sharp(await readFile(join(root, 'pets', 'stapu-spritesheet.webp'))).metadata();
    expect([pet.width, pet.height]).toEqual([1536, 2288]);
  });
});
```

- [ ] **Step 2: Run the asset contract and verify that it fails because the files do not exist**

Run: `npm test -- --run src/assets/heroAssets.test.js`  
Expected: FAIL with `ENOENT` for `hero-cockpit-space.webp`.

- [ ] **Step 3: Create optimized assets**

Use ImageGen background removal on each of the five prop images with this preservation contract:

```text
Remove only the black studio background and floor. Preserve the complete metal object, engraved details, colored light strips, original perspective, material wear, and every outer edge. Return a transparent-background PNG with no added object, no new shadow plate, and no camera change.
```

Convert the approved outputs to lossless-alpha WebP at 1254×1254 maximum. Convert `環繞空間參考圖.png` to a quality-84 WebP at 1672×941. Copy the exact Stapu spritesheet without resizing. The destination filenames are the ones listed in this task.

- [ ] **Step 4: Run the asset contract**

Run: `npm test -- --run src/assets/heroAssets.test.js`  
Expected: PASS, with every prop reporting alpha and Stapu reporting 1536×2288.

- [ ] **Step 5: Commit the asset contract and optimized assets**

```bash
git add src/assets/heroAssets.test.js src/assets/scenes/hero-cockpit-space.webp src/assets/props src/assets/pets/stapu-spritesheet.webp
git commit -m "feat: prepare cockpit and Stapu assets"
```

### Task 2: Add the AI lab route and localized station content

**Files:**
- Modify: `src/lib/siteRoute.js`
- Modify: `src/data/stations.js`
- Modify: `src/data/content.js`
- Modify: `src/components/RouteMap.jsx`
- Modify: `src/components/RouteMap.test.jsx`
- Modify: `src/App.test.jsx`

**Interfaces:**
- Produces: route id `ai-lab`, pathname `/ai-lab`, `content[lang].aiLab`, and an enabled route-map station.

- [ ] **Step 1: Write failing route and route-map tests**

```js
expect(getSiteRoute('/ai-lab')).toBe('ai-lab');
expect(getStationByRoute('/ai-lab')).toMatchObject({ id: 'ai-lab', next: 'cockpit' });

renderRouteMap({ currentRoute: '/profile', onTravel });
fireEvent.click(screen.getByRole('button', { name: 'AI Lab' }));
expect(onTravel).toHaveBeenCalledWith('/ai-lab');
expect(screen.getByRole('button', { name: /Private Archive.*Coming soon/i })).toBeDisabled();
```

- [ ] **Step 2: Run the focused tests and verify the route is absent**

Run: `npm test -- --run src/components/RouteMap.test.jsx src/App.test.jsx`  
Expected: FAIL because `/ai-lab` maps to cockpit and AI Lab is disabled.

- [ ] **Step 3: Add the station and honest localized content**

Add this station object before `making-of`:

```js
{ id: 'ai-lab', route: '/ai-lab', zh: 'AI 實驗艙', en: 'AI Lab', next: 'cockpit' },
```

Add `'/ai-lab': 'ai-lab'` to `getSiteRoute`. Remove AI Lab from `comingSoonStations`; leave Private Archive disabled. Change both Hero `ai-lab` entries from `{ status: 'coming-soon' }` to `{ target: '/ai-lab' }`. Add `aiLab` copy in both languages with these keys:

```js
{
  title: 'AI 實驗艙',
  incubationTitle: 'AI 小程式孵化槽',
  incubationStatus: '培育中；第一個可公開實驗完成後會在這裡解鎖。',
  petTitle: '史達普 Stapu',
  petBody: '阿居的 Codex 寵物，也是這艘實驗艙裡四處巡看的小助手。',
  skillsTitle: 'Skills 工具櫃',
  openPet: '查看史達普資料',
  openSkills: '拉開 Skills 工具櫃',
  returnCockpit: '返回駕駛艙',
}
```

The English object uses the same keys with concise English translations.

- [ ] **Step 4: Run route tests**

Run: `npm test -- --run src/components/RouteMap.test.jsx src/App.test.jsx`  
Expected: PASS with AI Lab enabled and Private Archive still pending.

- [ ] **Step 5: Commit route and copy changes**

```bash
git add src/lib/siteRoute.js src/data/stations.js src/data/content.js src/components/RouteMap.jsx src/components/RouteMap.test.jsx src/App.test.jsx
git commit -m "feat: register the AI lab station"
```

### Task 3: Model the Hero visit and activation states

**Files:**
- Create: `src/components/hero/heroState.js`
- Create: `src/components/hero/heroState.test.js`

**Interfaces:**
- Produces: `getInitialHeroApproach({ reduce, storage })`, `rememberHeroApproach(storage)`, and `getDestinationAction(id)`.

- [ ] **Step 1: Write failing state tests**

```js
import { describe, expect, it, vi } from 'vitest';
import { getDestinationAction, getInitialHeroApproach, rememberHeroApproach } from './heroState';

describe('hero state', () => {
  it('starts far once, then starts near for the session', () => {
    const storage = { getItem: vi.fn(() => null), setItem: vi.fn() };
    expect(getInitialHeroApproach({ reduce: false, storage })).toBe(0);
    rememberHeroApproach(storage);
    expect(storage.setItem).toHaveBeenCalledWith('hero-approached', '1');
    storage.getItem.mockReturnValue('1');
    expect(getInitialHeroApproach({ reduce: false, storage })).toBe(1);
    expect(getInitialHeroApproach({ reduce: true, storage })).toBe(1);
  });

  it('maps each control to one exclusive action', () => {
    expect(getDestinationAction('intro')).toEqual({ kind: 'travel', target: '/profile', motion: 'pull' });
    expect(getDestinationAction('career')).toEqual({ kind: 'travel', target: '/career-tree', motion: 'push' });
    expect(getDestinationAction('portfolio')).toEqual({ kind: 'travel', target: '/portfolio', motion: 'turn' });
    expect(getDestinationAction('ai-lab')).toEqual({ kind: 'preview', target: '/ai-lab', motion: 'boot' });
  });
});
```

- [ ] **Step 2: Run the state tests and verify they fail**

Run: `npm test -- --run src/components/hero/heroState.test.js`  
Expected: FAIL because `heroState.js` does not exist.

- [ ] **Step 3: Implement pure Hero state helpers**

```js
const APPROACHED_KEY = 'hero-approached';
const actions = {
  intro: { kind: 'travel', target: '/profile', motion: 'pull' },
  career: { kind: 'travel', target: '/career-tree', motion: 'push' },
  portfolio: { kind: 'travel', target: '/portfolio', motion: 'turn' },
  'ai-lab': { kind: 'preview', target: '/ai-lab', motion: 'boot' },
};

export const getInitialHeroApproach = ({ reduce, storage }) =>
  reduce || storage?.getItem(APPROACHED_KEY) === '1' ? 1 : 0;
export const rememberHeroApproach = (storage) => storage?.setItem(APPROACHED_KEY, '1');
export const getDestinationAction = (id) => actions[id];
```

- [ ] **Step 4: Run the state tests**

Run: `npm test -- --run src/components/hero/heroState.test.js`  
Expected: PASS.

- [ ] **Step 5: Commit Hero state helpers**

```bash
git add src/components/hero/heroState.js src/components/hero/heroState.test.js
git commit -m "test: define cockpit visit and control states"
```

### Task 4: Build tactile destination controls and the AI hologram

**Files:**
- Create: `src/components/hero/HeroDestinationControl.jsx`
- Create: `src/components/hero/HeroHologram.jsx`
- Create: `src/components/hero/HeroDestinationControl.test.jsx`
- Create: `src/components/hero/HeroHologram.test.jsx`
- Create: `src/components/hero/HeroControls.css`

**Interfaces:**
- `HeroDestinationControl({ entry, image, motion, enabled, busy, onActivate })` calls `onActivate(entry)` once after 450 ms or immediately under reduced motion.
- `HeroHologram({ open, onClose, onEnter })` traps focus, closes on Escape, and returns focus to the core opener.

- [ ] **Step 1: Write failing control tests**

```jsx
vi.useFakeTimers();
const onActivate = vi.fn();
render(<HeroDestinationControl entry={{ id: 'career', label: '航跡樹站' }} image="/control.webp" motion="push" enabled onActivate={onActivate} />);
fireEvent.click(screen.getByRole('button', { name: '航跡樹站' }));
expect(onActivate).not.toHaveBeenCalled();
act(() => vi.advanceTimersByTime(450));
expect(onActivate).toHaveBeenCalledOnce();
expect(screen.getByRole('button')).toHaveAttribute('data-motion', 'push');
```

```jsx
render(<HeroHologram open onClose={onClose} onEnter={onEnter} />);
expect(screen.getByRole('dialog', { name: /AI Lab preview/i })).toHaveFocus();
fireEvent.click(screen.getByRole('button', { name: /Enter AI Lab/i }));
expect(onEnter).toHaveBeenCalledOnce();
fireEvent.keyDown(document, { key: 'Escape' });
expect(onClose).toHaveBeenCalledOnce();
```

- [ ] **Step 2: Run focused tests and verify missing components**

Run: `npm test -- --run src/components/hero/HeroDestinationControl.test.jsx src/components/hero/HeroHologram.test.jsx`  
Expected: FAIL because both modules do not exist.

- [ ] **Step 3: Implement the controls**

Render each destination as a semantic button containing the transparent prop image and engraved label. Guard `busy || !enabled`; set `data-motion` during the 450 ms action; clear its timer on unmount. The AI core uses the same boot animation but opens `HeroHologram` instead of calling station travel.

The hologram renders a portal dialog with three localized signals, an explicit Enter button, a Close button, Escape handling, body lock via `acquireBodyScrollLock`, a two-button focus loop, and focus return to the core.

- [ ] **Step 4: Run control tests**

Run: `npm test -- --run src/components/hero/HeroDestinationControl.test.jsx src/components/hero/HeroHologram.test.jsx`  
Expected: PASS with one delayed activation, focus trapping, Escape, and focus return.

- [ ] **Step 5: Commit tactile controls**

```bash
git add src/components/hero
git commit -m "feat: add tactile cockpit controls and hologram"
```

### Task 5: Recompose the Hero cockpit

**Files:**
- Modify: `src/components/Hero.jsx`
- Replace: `src/components/Hero.css`
- Modify: `src/components/Hero.test.jsx`

**Interfaces:**
- Consumes: Task 1 assets, Task 3 state helpers, Task 4 control and hologram components.
- Produces: the final `Hero({ onTravel })` station with far/near states and an unlockable archive bin.

- [ ] **Step 1: Extend Hero tests for approved behavior**

Add tests that assert:

```jsx
expect(cockpit).toHaveAttribute('data-approach', '0');
expect(screen.getByRole('button', { name: /archive/i })).toBeDisabled();
fireEvent.wheel(cockpit, { deltaY: -800 });
expect(sessionStorage.getItem('hero-approached')).toBe('1');
expect(screen.getByRole('button', { name: /archive/i })).toBeEnabled();
expect(container.querySelector('.hero__control-rail')).toHaveClass('hero__control-rail');
```

Test that general controls travel after their action timer, AI opens a dialog first, reduced motion starts near, and remounting in one session starts near.

- [ ] **Step 2: Run Hero tests and verify the old cockpit fails the new contract**

Run: `npm test -- --run src/components/Hero.test.jsx`  
Expected: FAIL because the archive is always enabled, props are not present, and session approach is not remembered.

- [ ] **Step 3: Implement the Hero composition**

Use the single cockpit background, the existing colored captain image, a non-textual approach light stream, a trapezoid foreground console, four `HeroDestinationControl` instances, the AI hologram, and the transparent trash image. Load prop images only when approach becomes `1`; render metal fallback bodies until loaded or when an image errors.

Keep the existing wheel and pointer direction. On approach, call `rememberHeroApproach(sessionStorage)`. Animate the captain with scale and downward viewport exit rather than lateral walking or immediate opacity removal. Keep the trash visible but disabled at approach `0` and enabled at approach `1`.

Desktop control order is handle, joystick, knob, core. At `max-width: 700px`, use `display:flex`, `overflow-x:auto`, `scroll-snap-type:x mandatory`, control basis `58.8%`, and scroll padding so about 1.7 controls remain visible.

- [ ] **Step 4: Run Hero tests and build**

Run: `npm test -- --run src/components/Hero.test.jsx && npm run build`  
Expected: Hero tests PASS and Vite build exits 0.

- [ ] **Step 5: Commit the Hero rebuild**

```bash
git add src/components/Hero.jsx src/components/Hero.css src/components/Hero.test.jsx
git commit -m "feat: rebuild the cockpit as a 2.5D control station"
```

### Task 6: Add the Stapu sprite player

**Files:**
- Create: `src/components/ai-lab/stapuSprite.js`
- Create: `src/components/ai-lab/stapuSprite.test.js`
- Create: `src/components/ai-lab/StapuPet.jsx`
- Create: `src/components/ai-lab/StapuPet.test.jsx`
- Create: `src/components/ai-lab/StapuPet.css`

**Interfaces:**
- `getStapuFrameStyle({ row, frame })` returns `{ '--stapu-x': '-N%', '--stapu-y': '-N%' }` for the 8×11 atlas.
- `StapuPet({ onInspect })` cycles running-right → waving → running-left → idle and freezes to idle under reduced motion.

- [ ] **Step 1: Write failing sprite math and interaction tests**

```js
expect(getStapuFrameStyle({ row: 2, frame: 3 })).toEqual({ '--stapu-x': '-37.5%', '--stapu-y': '-18.1818%' });
expect(getStapuFrameStyle({ row: 0, frame: 0 })).toEqual({ '--stapu-x': '0%', '--stapu-y': '0%' });
```

```jsx
render(<StapuPet onInspect={onInspect} />);
expect(screen.getByRole('button', { name: /Stapu/i })).toHaveAttribute('data-state', 'running-right');
fireEvent.click(screen.getByRole('button', { name: /Stapu/i }));
expect(onInspect).toHaveBeenCalledOnce();
```

- [ ] **Step 2: Run Stapu tests and verify missing modules**

Run: `npm test -- --run src/components/ai-lab/stapuSprite.test.js src/components/ai-lab/StapuPet.test.jsx`  
Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Implement the sprite viewport**

Render one `<img>` at 800% width and 1100% height inside an overflow-hidden frame. Apply `translate(var(--stapu-x), var(--stapu-y))`; advance only through the used frame count for the active row. Use finite timeouts for state changes and clear every timeout on unmount. The clickable wrapper owns the accessible name; the atlas image is decorative.

- [ ] **Step 4: Run Stapu tests**

Run: `npm test -- --run src/components/ai-lab/stapuSprite.test.js src/components/ai-lab/StapuPet.test.jsx`  
Expected: PASS, including timer cleanup and reduced-motion idle state.

- [ ] **Step 5: Commit Stapu player**

```bash
git add src/components/ai-lab/stapuSprite.js src/components/ai-lab/stapuSprite.test.js src/components/ai-lab/StapuPet.jsx src/components/ai-lab/StapuPet.test.jsx src/components/ai-lab/StapuPet.css
git commit -m "feat: bring Stapu into the AI lab"
```

### Task 7: Build the AI lab station and in-scene panels

**Files:**
- Create: `src/components/AiLab.jsx`
- Create: `src/components/AiLab.css`
- Create: `src/components/AiLab.test.jsx`
- Create: `src/components/ai-lab/IncubationPod.jsx`
- Create: `src/components/ai-lab/SkillsCabinet.jsx`
- Create: `src/components/ai-lab/LabPanel.jsx`
- Modify: `src/App.jsx`
- Modify: `src/App.test.jsx`

**Interfaces:**
- `AiLab({ controls })` owns its in-scene return control.
- `LabPanel({ open, title, onClose, children, returnFocusTo })` provides portal dialog behavior.
- `SkillsCabinet({ onOpen })` opens a list of skills actually used in the project.

- [ ] **Step 1: Write the failing AI lab tests**

```jsx
render(<LanguageProvider><AiLab controls={<button>Return to Cockpit</button>} /></LanguageProvider>);
expect(screen.getByRole('heading', { name: 'AI Lab' })).toBeInTheDocument();
expect(screen.getByRole('button', { name: /Inspect Stapu/i })).toBeEnabled();
expect(screen.getByRole('button', { name: /Open Skills cabinet/i })).toBeEnabled();
expect(screen.getByText(/incubating/i)).toBeInTheDocument();
expect(screen.getByRole('button', { name: 'Return to Cockpit' })).toBeInTheDocument();
```

Open the pet and Skills panels; assert role dialog, Escape close, body lock, and focus return. Assert exactly one incubation pod and no fake project cards.

- [ ] **Step 2: Run the AI lab tests and verify the station is absent**

Run: `npm test -- --run src/components/AiLab.test.jsx src/App.test.jsx`  
Expected: FAIL because `AiLab` and the `/ai-lab` station render path do not exist.

- [ ] **Step 3: Implement the station**

Build one industrial room scene with a central CSS incubation pod, a lower Stapu platform, and a right-side Skills cabinet. The pod uses metal shells, a transparent shield layer, scan line, core glow, and honest incubating text. The Skills panel lists only:

```js
[
  { id: 'impeccable', use: '統一介面、動態與可讀性' },
  { id: 'grill-me', use: '在動工前釐清每個視覺與互動決策' },
  { id: 'brainstorming', use: '把想法整理成可驗收的設計規格' },
  { id: 'hatch-pet', use: '製作並驗證史達普的完整動畫表' },
]
```

Add localized English equivalents. Use `LabPanel` for both Stapu and Skills details. Mount `AiLab` for route `ai-lab`; pass station controls into it and suppress the external controls block for `career-tree` and `ai-lab`.

- [ ] **Step 4: Run AI lab and app tests**

Run: `npm test -- --run src/components/AiLab.test.jsx src/App.test.jsx`  
Expected: PASS with one in-scene control set, routable AI lab, and accessible panels.

- [ ] **Step 5: Commit the AI lab**

```bash
git add src/components/AiLab.jsx src/components/AiLab.css src/components/AiLab.test.jsx src/components/ai-lab src/App.jsx src/App.test.jsx
git commit -m "feat: add the Stapu AI lab station"
```

### Task 8: Integration, accessibility, performance, and visual QA

**Files:**
- Modify: `src/components/Hero.css`
- Modify: `src/components/AiLab.css`
- Modify: `src/index.css` only if a shared z-index token is required
- Modify: tests discovered by the integration run only when behavior, not assertions, is wrong

**Interfaces:**
- Produces: a release-ready responsive cockpit and AI lab without regressions in existing stations.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm test -- --run`  
Expected: 0 failed test files and 0 failed tests.

- [ ] **Step 2: Run static and production checks**

Run: `npm run lint && npm run build`  
Expected: both commands exit 0; Vite emits `/dist` without missing asset warnings.

- [ ] **Step 3: Inspect the local site at all acceptance sizes**

Use the existing dev server and capture Hero far, Hero near, AI hologram, and AI lab at:

```text
360×800
390×844
644×698
795×698
1280×720
1440×900
```

Verify no horizontal page overflow; the mobile control rail itself may scroll horizontally. Confirm the captain is grounded, props sit on the console, the trash replaces rather than duplicates the purple box, permanent engravings fit, and the next mobile control remains partially visible.

- [ ] **Step 4: Exercise interaction and fallback states**

Verify wheel-up/swipe-up approach, reverse retreat, session return-near state, one-shot control actions, AI preview-before-travel, Escape/focus return, route-map navigation, reduced motion, broken prop fallback, and Stapu sprite fallback.

- [ ] **Step 5: Run the Impeccable detector on changed UI files and fix relevant findings**

Run: `node C:/Users/any50/Downloads/履歷網站/.agents/skills/impeccable/scripts/detect.mjs --json src/components/Hero.jsx src/components/Hero.css src/components/AiLab.jsx src/components/AiLab.css src/components/hero src/components/ai-lab`  
Expected: no unresolved accessibility, overflow, low-contrast, hidden-content, or banned-pattern findings relevant to the changed surfaces.

- [ ] **Step 6: Re-run verification after visual fixes**

Run: `npm test -- --run && npm run lint && npm run build`  
Expected: all tests, lint, and build pass after the final CSS changes.

- [ ] **Step 7: Commit final quality fixes**

```bash
git add src
git commit -m "fix: complete cockpit and AI lab quality pass"
```
