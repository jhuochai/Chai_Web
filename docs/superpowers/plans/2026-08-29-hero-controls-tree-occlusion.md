# Hero Controls and Career Tree Occlusion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Hero controls physically usable and correctly distributed across the curved console, while making every career ribbon and game bloom visibly attach to tree branches through matched foreground occlusion.

**Architecture:** Keep all controls, ribbons, and blooms as independent interactive layers. Move scene-space coordinates into a focused layout module, render one SVG-based foreground occlusion layer that reuses the exact day/night background image, and keep all three career-tree layers inside the existing camera canvas so zoom and responsive cropping remain synchronized.

**Tech Stack:** React 19, Vite, Vitest, Testing Library, CSS, inline SVG clip paths, Motion.

## Global Constraints

- Do not uniformly enlarge the four Hero controls; size each from adult one-hand operation logic using the yoke grips as the scale reference.
- Preserve control order: Captain's Office knob, Career Tree joystick, Portfolio pull lever, AI Lab core.
- Preserve each existing control animation and route.
- Keep ribbons and blooms independent, clickable, animated assets.
- Do not redraw the full career-tree backgrounds or change approved item colors.
- Day and night occlusion content must reuse the matching background image pixels.
- Background, item, and foreground occlusion must share the same `career-tree__canvas` camera transform.
- Run Impeccable desktop and mobile visual checks before showing the result.

---

## File Structure

- Create `src/data/careerTreeLayout.js`: scene-space item coordinates and foreground occlusion geometry.
- Create `src/data/careerTreeLayout.test.js`: structural and trunk-clearance tests for the layout data.
- Create `src/components/TreeOcclusionLayer.jsx`: one decorative SVG overlay using the matching scene image and clip-path geometry.
- Create `src/components/TreeOcclusionLayer.test.jsx`: semantics, image-source, and patch-count tests.
- Modify `src/components/CareerTree.jsx`: consume the layout module and render the day/night foreground layer after interactive items.
- Modify `src/components/CareerTree.css`: layer order, responsive synchronization, attachment shadows, and item optical scale.
- Modify `src/components/CareerTree.test.jsx`: integration checks for the three-layer scene and preserved interactions.
- Modify `src/components/Hero.css`: yoke crop/position plus physically scaled control placement on the four console panels.
- Modify `src/components/Hero.test.jsx`: desktop and mobile placement contract.

---

### Task 1: Lock the Hero physical-layout contract

**Files:**
- Modify: `src/components/Hero.test.jsx`
- Modify: `src/components/Hero.css`

**Interfaces:**
- Consumes: existing destination IDs `intro`, `career`, `portfolio`, `ai-lab`.
- Produces: CSS placement rules with four separate control sizes and panel-center positions.

- [ ] **Step 1: Write a failing desktop layout test**

Add assertions that the four controls are separated across the console and do not share one scale:

```jsx
it('sizes controls by how a hand would operate them and centers them on four panels', () => {
  const css = readFileSync(new URL('./Hero.css', import.meta.url), 'utf8');
  expect(css).toMatch(/data-destination='intro'[\s\S]*left:\s*14%[\s\S]*width:\s*clamp\(68px,\s*8vw,\s*116px\)/);
  expect(css).toMatch(/data-destination='career'[\s\S]*left:\s*34%[\s\S]*height:\s*clamp\(112px,\s*18vh,\s*176px\)/);
  expect(css).toMatch(/data-destination='portfolio'[\s\S]*left:\s*66%[\s\S]*width:\s*clamp\(82px,\s*9vw,\s*132px\)/);
  expect(css).toMatch(/data-destination='ai-lab'[\s\S]*left:\s*86%[\s\S]*width:\s*clamp\(76px,\s*8.5vw,\s*124px\)/);
  expect(css).toMatch(/hero__console-layer[\s\S]*object-position:\s*center\s+bottom/);
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npx vitest run --dir src src/components/Hero.test.jsx --maxWorkers=1 --reporter=dot`

Expected: FAIL because current positions remain `16%`, `32%`, `68%`, `84%` and use viewport-width-only dimensions.

- [ ] **Step 3: Implement the physical layout**

In `Hero.css`, place the controls on panel centers rather than around the yoke:

```css
.hero__destination-control[data-destination='intro'] {
  left: 14%;
  bottom: 17%;
  width: clamp(68px, 8vw, 116px);
  height: clamp(68px, 8vw, 116px);
}

.hero__destination-control[data-destination='career'] {
  left: 34%;
  bottom: 18%;
  width: clamp(66px, 7vw, 104px);
  height: clamp(112px, 18vh, 176px);
}

.hero__destination-control[data-destination='portfolio'] {
  left: 66%;
  bottom: 17%;
  width: clamp(82px, 9vw, 132px);
  height: clamp(82px, 9vw, 132px);
}

.hero__destination-control[data-destination='ai-lab'] {
  left: 86%;
  bottom: 18%;
  width: clamp(76px, 8.5vw, 124px);
  height: clamp(76px, 8.5vw, 124px);
}
```

Keep the generated console image centered at the bottom. Reduce the visible yoke by lowering the console layer rather than scaling all four controls up. Add one directional contact shadow per control that follows the console plane.

- [ ] **Step 4: Add and implement the mobile contract**

Assert and then implement a 390px layout with distinct sizes, preserved order, 44px minimum targets, and no control crossing the yoke centerline.

- [ ] **Step 5: Run focused Hero tests**

Run: `npx vitest run --dir src src/components/Hero.test.jsx src/components/hero/HeroDestinationControl.test.jsx src/components/hero/heroState.test.js --maxWorkers=1 --reporter=dot`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.css src/components/Hero.test.jsx
git commit -m "fix: align cockpit controls to usable panel positions"
```

---

### Task 2: Extract branch-safe scene coordinates

**Files:**
- Create: `src/data/careerTreeLayout.js`
- Create: `src/data/careerTreeLayout.test.js`
- Modify: `src/components/CareerTree.jsx`

**Interfaces:**
- Produces: `RIBBON_SPOTS`, `GAME_BLOOM_LAYOUT`, `DAY_OCCLUSION_PATCHES`, `NIGHT_OCCLUSION_PATCHES`.
- Coordinates use original 1672×941 image-space percentages; occlusion patches use image-space pixels.

- [ ] **Step 1: Write failing layout-data tests**

```js
import {
  RIBBON_SPOTS,
  GAME_BLOOM_LAYOUT,
  DAY_OCCLUSION_PATCHES,
  NIGHT_OCCLUSION_PATCHES,
} from './careerTreeLayout';

it('keeps all twelve blooms off the main trunk corridor', () => {
  expect(Object.values(GAME_BLOOM_LAYOUT)).toHaveLength(12);
  for (const bloom of Object.values(GAME_BLOOM_LAYOUT)) {
    const x = Number.parseFloat(bloom.left);
    const y = Number.parseFloat(bloom.top);
    expect(y < 58 || x <= 45 || x >= 56).toBe(true);
  }
});

it('provides one occlusion attachment for every decoration', () => {
  expect(DAY_OCCLUSION_PATCHES).toHaveLength(4);
  expect(NIGHT_OCCLUSION_PATCHES).toHaveLength(12);
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npx vitest run --dir src src/data/careerTreeLayout.test.js --maxWorkers=1 --reporter=dot`

Expected: FAIL because the layout module does not exist.

- [ ] **Step 3: Create the layout module**

Move the four ribbon coordinates out of `CareerTree.jsx`. Reposition blooms near branch forks and canopy edges, keeping the trunk corridor clear. Define each occlusion patch as:

```js
{
  id: 'gamesofa',
  cx: 574,
  cy: 378,
  rx: 24,
  ry: 10,
  rotation: -18,
}
```

Use exactly four day patches and twelve night patches. Each ellipse should cover only the attachment seam, not the recognizable center of the decoration.

- [ ] **Step 4: Update `CareerTree.jsx` imports**

Remove the inline `RIBBON_SPOTS` and `GAME_BLOOM_LAYOUT`; import all four arrays from `../data/careerTreeLayout`.

- [ ] **Step 5: Run layout and existing CareerTree tests**

Run: `npx vitest run --dir src src/data/careerTreeLayout.test.js src/components/CareerTree.test.jsx --maxWorkers=1 --reporter=dot`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/careerTreeLayout.js src/data/careerTreeLayout.test.js src/components/CareerTree.jsx
git commit -m "refactor: centralize career tree scene coordinates"
```

---

### Task 3: Add matched branch-and-leaf foreground occlusion

**Files:**
- Create: `src/components/TreeOcclusionLayer.jsx`
- Create: `src/components/TreeOcclusionLayer.test.jsx`
- Modify: `src/components/CareerTree.jsx`
- Modify: `src/components/CareerTree.css`
- Modify: `src/components/CareerTree.test.jsx`

**Interfaces:**
- `TreeOcclusionLayer({ source, mode, patches })` renders one non-interactive SVG image clipped to attachment patches.
- `patches` is an array of `{ id, cx, cy, rx, ry, rotation }`.

- [ ] **Step 1: Write failing component tests**

```jsx
it('reuses the matching scene image and exposes no interaction surface', () => {
  render(<TreeOcclusionLayer source="day.webp" mode="day" patches={patches} />);
  const layer = screen.getByTestId('tree-occlusion-day');
  expect(layer).toHaveAttribute('aria-hidden', 'true');
  expect(layer.querySelectorAll('ellipse')).toHaveLength(patches.length);
  expect(layer.querySelector('image')).toHaveAttribute('href', 'day.webp');
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run: `npx vitest run --dir src src/components/TreeOcclusionLayer.test.jsx --maxWorkers=1 --reporter=dot`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement one SVG foreground layer**

```jsx
export default function TreeOcclusionLayer({ source, mode, patches }) {
  const clipId = `tree-occlusion-${mode}`;
  return (
    <svg
      className={`career-tree__occlusion career-tree__occlusion--${mode}`}
      viewBox="0 0 1672 941"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-testid={`tree-occlusion-${mode}`}
    >
      <defs>
        <clipPath id={clipId}>
          {patches.map((patch) => (
            <ellipse
              key={patch.id}
              cx={patch.cx}
              cy={patch.cy}
              rx={patch.rx}
              ry={patch.ry}
              transform={`rotate(${patch.rotation} ${patch.cx} ${patch.cy})`}
            />
          ))}
        </clipPath>
      </defs>
      <image href={source} width="1672" height="941" preserveAspectRatio="none" clipPath={`url(#${clipId})`} />
    </svg>
  );
}
```

- [ ] **Step 4: Insert the foreground after interactive items**

Render both day and night overlays inside `career-tree__canvas`; crossfade them with the same active-mode classes used by the background images.

- [ ] **Step 5: Add layer-order and synchronization CSS**

```css
.career-tree__sky { z-index: 0; }
.career-tree__spot { z-index: 2; }
.career-tree__occlusion {
  position: absolute;
  inset: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1s ease;
}
.career-tree__occlusion--active { opacity: 1; }
.career-tree__leaves { z-index: 4; }
```

- [ ] **Step 6: Add integration assertions**

Verify day and night layers exist, only the matching layer is active, the masks contain 4 and 12 patches, and toggling day/night preserves button interactivity.

- [ ] **Step 7: Run focused tests**

Run: `npx vitest run --dir src src/components/TreeOcclusionLayer.test.jsx src/components/CareerTree.test.jsx src/components/GameBloom.test.jsx --maxWorkers=1 --reporter=dot`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/components/TreeOcclusionLayer.jsx src/components/TreeOcclusionLayer.test.jsx src/components/CareerTree.jsx src/components/CareerTree.css src/components/CareerTree.test.jsx
git commit -m "feat: integrate career decorations with branch occlusion"
```

---

### Task 4: Impeccable visual pass and bounded correction

**Files:**
- Modify only files already listed when the rendered evidence identifies a real defect.

**Interfaces:**
- Consumes: completed Hero and Career Tree implementation.
- Produces: a visually approved desktop and mobile path with no new behavior.

- [ ] **Step 1: Inspect Hero at desktop and 390×844**

Check far state, scroll-forward state, all four control positions, yoke clearance, contact shadows, focus rings, and tap targets.

- [ ] **Step 2: Inspect Career Tree day and night at desktop and 390×844**

Check all four ribbon knots, all twelve flower attachment seams, trunk clearance, item scale relative to the hanging lamp, day/night crossfade, and camera zoom synchronization.

- [ ] **Step 3: Apply one batched correction pass**

Adjust only coordinates, patch ellipse geometry, and optical CSS values found wrong in Step 1–2. Do not add new effects or broaden scope.

- [ ] **Step 4: Confirm with one final desktop/mobile pass**

Stop after the confirmation pass. Record remaining intentional constraints rather than beginning an open-ended polish loop.

---

### Task 5: Functional and production verification

**Files:**
- No new files expected.

- [ ] **Step 1: Click every Hero destination**

Verify `/profile`, `/career-tree`, `/portfolio`, and `/ai-lab` all load from their correct control.

- [ ] **Step 2: Open and close representative day and night records**

Verify a ribbon and a bloom open by mouse and keyboard; Escape restores focus; closing does not reset camera progress.

- [ ] **Step 3: Run the full test suite**

Run: `npx vitest run --dir src --maxWorkers=1 --reporter=dot`

Expected: all test files and tests PASS.

- [ ] **Step 4: Run the production build**

Run: `npm run build`

Expected: exit code 0 and a generated `dist/` bundle.

- [ ] **Step 5: Review the source diff**

Run: `git diff --check` and `git status --short`.

Expected: no whitespace errors; the existing unrelated `史達普Stapu寵物/` directory remains untouched.

- [ ] **Step 6: Commit the final bounded correction if needed**

```bash
git add src/components/Hero.css src/components/Hero.test.jsx src/data/careerTreeLayout.js src/data/careerTreeLayout.test.js src/components/TreeOcclusionLayer.jsx src/components/TreeOcclusionLayer.test.jsx src/components/CareerTree.jsx src/components/CareerTree.css src/components/CareerTree.test.jsx
git commit -m "polish: finish cockpit and career tree spatial integration"
```

