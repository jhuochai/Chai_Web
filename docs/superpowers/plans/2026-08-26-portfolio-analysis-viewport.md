# Portfolio Analysis Viewport Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Replace the screenshot-driven WebGL portfolio gallery with a Hero-cockpit-aligned analysis hatch whose two physical case cards are directly clickable, draggable, keyboard-operable, and visually faithful to the approved concept.

**Architecture:** Keep \`Portfolio\` as the owner of selected/open case state and keep \`CaseAnalysisDesk\` unchanged. Replace the OGL implementation inside \`CircularGallery\` with a small DOM carousel that renders actual \`<button>\` cards, while a generated transparent hatch image provides the industrial frame. Store the generated hatch and two card renders as separate assets so card movement remains real UI motion instead of a flat composite image.

**Tech Stack:** React 19, CSS transforms, Vitest, Testing Library, Vite asset imports, built-in ImageGen, Sharp metadata checks.

## Global Constraints

- The circular frame must read as a physical extension of the Hero cockpit: dark gunmetal, champagne-gold trim, bolts, engraved ticks, and sparse cyan instrument light.
- The Cat Café card must be ivory-white ceramic-metal with a champagne-gold frame and the supplied colorful logo.
- The Dark Chess card must be dark walnut with black-gold metal framing and the supplied \`將\` logo.
- Do not use the old case screenshots as gallery covers.
- Remove the two detached selector boxes below the gallery.
- Every visible case card must directly open the correct existing case dialog.
- Drag/swipe and Left/Right keys change the centered card without opening it.
- Preserve the existing case data, \`CaseAnalysisDesk\`, same-route dialog behavior, and bilingual accessible labels.
- Reduced-motion mode must remove 3D travel and use an opacity change instead.
- Do not stage or alter the existing untracked Hero preview assets.

---

## File Structure

- Create \`src/assets/portfolio/analysis-hatch-frame-v1.webp\`: transparent industrial circular hatch frame only.
- Create \`src/assets/portfolio/cat-cafe-case-card-v1.webp\`: transparent Cat Café physical card render.
- Create \`src/assets/portfolio/dark-chess-case-card-v1.webp\`: transparent Dark Chess physical card render.
- Modify \`src/data/portfolioCases.js\`: add a dedicated \`card\` asset to each case while preserving its current evidence media.
- Replace \`src/components/CircularGallery.jsx\`: remove the OGL renderer and provide a focused DOM carousel with direct card buttons.
- Replace \`src/components/CircularGallery.css\`: style the card track, centered/side states, pointer affordance, and reduced motion.
- Modify \`src/components/Portfolio.jsx\`: render the hatch asset and pass card assets to the gallery.
- Modify \`src/components/Portfolio.css\`: simplify the current CSS-built bezel and place the generated hatch around the interactive card track.
- Modify \`src/components/CircularGallery.test.jsx\`: test direct-card semantics, keyboard movement, pointer drag, and click behavior.
- Modify \`src/components/Portfolio.test.jsx\`: test that detached selectors are gone and both card buttons open the correct dialogs.

---

### Task 1: Produce the three independent visual assets

**Files:**
- Create: \`src/assets/portfolio/analysis-hatch-frame-v1.webp\`
- Create: \`src/assets/portfolio/cat-cafe-case-card-v1.webp\`
- Create: \`src/assets/portfolio/dark-chess-case-card-v1.webp\`

**Interfaces:**
- Consumes: the approved concept image and the two user-supplied Logo references.
- Produces: three transparent WebP assets imported by \`portfolioCases.js\` and \`Portfolio.jsx\`.

- [ ] **Step 1: Generate the circular hatch as a separate transparent asset**

Use built-in ImageGen with the approved concept as the style reference:

\`\`\`text
Use case: precise-object-edit
Asset type: transparent website foreground frame
Primary request: isolate and rebuild only the circular industrial analysis hatch from the approved portfolio-analysis concept; remove every card and all interior content.
Composition: perfectly centered full circular ring, front-facing, equal margin on all sides, square canvas.
Materials: layered dark gunmetal, blackened iron, aged champagne-gold trim, bolts, engraved instrument ticks, sparse cyan indicator lights.
Constraints: transparent outside the ring and transparent through the entire inner opening; no card, no logo, no text, no wall, no background, no shadow filling the center; preserve believable thickness and cockpit-world wear.
\`\`\`

Copy the selected output to \`src/assets/portfolio/analysis-hatch-frame-v1.webp\` without deleting the generated original.

- [ ] **Step 2: Generate the Cat Café card**

Use the supplied Cat Café Logo as a high-fidelity compositing reference:

\`\`\`text
Use case: compositing
Asset type: transparent interactive case-card artwork
Primary request: create one front-facing portrait-oriented physical spaceship data cartridge and place the supplied Cat Café logo faithfully at its center.
Card: ivory-white ceramic-metal panel, champagne-gold structural frame, shallow circuit engraving, tiny rivets, restrained wear, two faint cyan indicator lights.
Composition: entire card visible with even transparent margin, no perspective skew, no scene behind it.
Constraints: preserve the supplied logo's characters, cat silhouette, colors, and proportions; transparent background; no extra copy, no screenshot, no floating panel, no additional logo.
\`\`\`

Copy the selected output to \`src/assets/portfolio/cat-cafe-case-card-v1.webp\`.

- [ ] **Step 3: Generate the Dark Chess card**

Use the supplied Dark Chess icon as a high-fidelity compositing reference:

\`\`\`text
Use case: compositing
Asset type: transparent interactive case-card artwork
Primary request: create one front-facing portrait-oriented physical spaceship data cartridge and place the supplied Dark Chess 將 logo faithfully at its center.
Card: deep walnut panel, blackened-steel structure, aged gold frame, restrained wear, two small amber indicator lights.
Composition: entire card visible with even transparent margin, no perspective skew, no scene behind it.
Constraints: preserve the supplied circular chess piece, black 將 character, and small lower-right brand mark; transparent background; no extra copy, no screenshot, no additional logo.
\`\`\`

Copy the selected output to \`src/assets/portfolio/dark-chess-case-card-v1.webp\`.

- [ ] **Step 4: Verify dimensions and alpha**

Run:

\`\`\`powershell
node -e "import('sharp').then(async({default:s})=>{for(const f of ['src/assets/portfolio/analysis-hatch-frame-v1.webp','src/assets/portfolio/cat-cafe-case-card-v1.webp','src/assets/portfolio/dark-chess-case-card-v1.webp']){const m=await s(f).metadata(); console.log(f,m.width,m.height,m.hasAlpha)}})"
\`\`\`

Expected: all paths print non-zero dimensions and \`true\` for \`hasAlpha\`.

- [ ] **Step 5: Visually inspect all isolated assets**

Confirm the hatch center is transparent, card edges are complete, the Cat Café Logo is legible, and the Dark Chess \`將\` glyph is undistorted.

- [ ] **Step 6: Commit only the new portfolio assets**

\`\`\`powershell
git add -- src/assets/portfolio/analysis-hatch-frame-v1.webp src/assets/portfolio/cat-cafe-case-card-v1.webp src/assets/portfolio/dark-chess-case-card-v1.webp
git commit -m "assets: add portfolio analysis hatch cards"
\`\`\`

---

### Task 2: Replace the canvas with direct interactive cards

**Files:**
- Modify: \`src/components/CircularGallery.jsx\`
- Modify: \`src/components/CircularGallery.css\`
- Modify: \`src/components/CircularGallery.test.jsx\`

**Interfaces:**
- Consumes: \`items: Array<{ id: string, image: string, text: string }>\`, \`activeId\`, \`onSelect(item)\`, and \`selectLabel(item)\`.
- Produces: \`.circular-gallery__card\` buttons, \`aria-current="true"\` on the centered card, and drag/swipe plus Left/Right centering.

- [ ] **Step 1: Write failing direct-card tests**

Replace \`src/components/CircularGallery.test.jsx\` with:

\`\`\`jsx
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CircularGallery from './CircularGallery';

const items = [
  { id: 'cat', image: '/cat.webp', text: '貓咪造咖' },
  { id: 'chess', image: '/chess.webp', text: '暗棋' },
];

describe('CircularGallery', () => {
  it('renders case cards as the only selectors', () => {
    render(<CircularGallery items={items} activeId="cat" onSelect={vi.fn()} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => \`開啟案例：\${item.text}\`} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass('circular-gallery__card');
    expect(buttons[0]).toHaveAttribute('aria-current', 'true');
    expect(document.querySelector('.circular-gallery__selectors')).toBeNull();
  });

  it('centers with arrow keys without opening', () => {
    const onSelect = vi.fn();
    render(<CircularGallery items={items} activeId="cat" onSelect={onSelect} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => \`開啟案例：\${item.text}\`} />);
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: '開啟案例：暗棋' })).toHaveAttribute('aria-current', 'true');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('centers after a pointer drag', () => {
    render(<CircularGallery items={items} activeId="cat" onSelect={vi.fn()} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => \`開啟案例：\${item.text}\`} />);
    const region = screen.getByRole('region');
    fireEvent.pointerDown(region, { clientX: 260, pointerId: 1 });
    fireEvent.pointerUp(region, { clientX: 150, pointerId: 1 });
    expect(screen.getByRole('button', { name: '開啟案例：暗棋' })).toHaveAttribute('aria-current', 'true');
  });

  it('opens the clicked card', () => {
    const onSelect = vi.fn();
    render(<CircularGallery items={items} activeId="cat" onSelect={onSelect} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => \`開啟案例：\${item.text}\`} />);
    fireEvent.click(screen.getByRole('button', { name: '開啟案例：暗棋' }));
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });
});
\`\`\`

- [ ] **Step 2: Verify the old canvas implementation fails**

Run \`npm test -- src/components/CircularGallery.test.jsx\`.

Expected: FAIL because the current component still renders detached selectors and does not center cards on the region.

- [ ] **Step 3: Replace \`CircularGallery.jsx\` with a DOM carousel**

Implement \`wrap(index, length)\`, \`cardOffset(index, activeIndex, length)\`, controlled synchronization from \`activeId\`, Left/Right key movement, a 36px pointer-drag threshold, and one actual button per card. Use this button structure:

\`\`\`jsx
<button
  type="button"
  className="circular-gallery__card"
  aria-label={selectLabel(item)}
  aria-current={offset === 0 ? 'true' : undefined}
  data-side={offset < 0 ? 'left' : offset > 0 ? 'right' : 'center'}
  style={{
    '--card-x': \`\${offset * 58}%\`,
    '--card-rotate': \`\${offset * -24}deg\`,
    '--card-scale': offset === 0 ? 1 : 0.72,
    '--card-depth': offset === 0 ? 2 : 1,
  }}
  onClick={() => {
    if (!dragged.current) onSelect?.(item);
    dragged.current = false;
  }}
>
  <img src={item.image} alt="" draggable="false" />
  <span className="circular-gallery__plate" aria-hidden="true">{item.text}</span>
</button>
\`\`\`

Delete all OGL renderer classes/imports and \`.circular-gallery__selectors\`.

- [ ] **Step 4: Replace \`CircularGallery.css\`**

Use a perspective track and custom properties from Step 3:

\`\`\`css
.circular-gallery { position:relative; width:100%; height:100%; overflow:hidden; touch-action:pan-y; }
.circular-gallery:focus-visible { outline:2px solid var(--cyan); outline-offset:-10px; }
.circular-gallery__track { position:absolute; inset:9% 8% 8%; perspective:1100px; transform-style:preserve-3d; }
.circular-gallery__card { position:absolute; z-index:var(--card-depth); top:50%; left:50%; width:clamp(150px,35%,270px); aspect-ratio:7/10; padding:0; border:0; background:transparent; cursor:pointer; transform:translate(-50%,-50%) translateX(var(--card-x)) rotateY(var(--card-rotate)) scale(var(--card-scale)); transition:transform 480ms cubic-bezier(.16,1,.3,1),filter 300ms ease,opacity 300ms ease; }
.circular-gallery__card[data-side]:not([data-side='center']) { filter:brightness(.58) saturate(.72); opacity:.86; }
.circular-gallery__card:hover { filter:brightness(1.08); }
.circular-gallery__card:focus-visible { outline:2px solid var(--cyan); outline-offset:5px; }
.circular-gallery__card img { display:block; width:100%; height:100%; object-fit:contain; pointer-events:none; user-select:none; }
.circular-gallery__plate { position:absolute; left:50%; bottom:4%; translate:-50% 0; width:max-content; max-width:88%; padding:.28rem .72rem; overflow:hidden; border:1px solid rgba(224,188,106,.45); background:#090d11e8; color:var(--parchment); font-size:clamp(.66rem,1.2vw,.82rem); text-overflow:ellipsis; white-space:nowrap; }
@media (max-width:520px) { .circular-gallery__track { inset:12% 3% 10%; } .circular-gallery__card { width:46%; } }
@media (prefers-reduced-motion:reduce) { .circular-gallery__card { transition:opacity 120ms linear,filter 120ms linear; transform:translate(-50%,-50%) translateX(var(--card-x)) scale(var(--card-scale)); } }
\`\`\`

- [ ] **Step 5: Run focused tests**

Run \`npm test -- src/components/CircularGallery.test.jsx\`.

Expected: 4 tests PASS.

- [ ] **Step 6: Commit the carousel**

\`\`\`powershell
git add -- src/components/CircularGallery.jsx src/components/CircularGallery.css src/components/CircularGallery.test.jsx
git commit -m "feat: make portfolio case cards directly interactive"
\`\`\`

---

### Task 3: Integrate the hatch and card assets

**Files:**
- Modify: \`src/data/portfolioCases.js\`
- Modify: \`src/components/Portfolio.jsx\`
- Modify: \`src/components/Portfolio.css\`
- Modify: \`src/components/Portfolio.test.jsx\`

**Interfaces:**
- Consumes: the Task 1 assets and Task 2 gallery API.
- Produces: two cases with \`card\` URLs and a framed \`.analysis-viewport__hatch\`.

- [ ] **Step 1: Update Portfolio tests**

Add these assertions to the first Portfolio test and preserve the existing dialog/focus/localization tests:

\`\`\`jsx
expect(container.querySelector('.analysis-viewport__hatch')).toBeInTheDocument();
expect(container.querySelector('.analysis-viewport__bezel')).toBeNull();
expect(container.querySelector('.circular-gallery__selectors')).toBeNull();
expect(screen.getAllByRole('button', { name: /開啟案例：/ })).toHaveLength(2);
\`\`\`

- [ ] **Step 2: Verify the integration test fails**

Run \`npm test -- src/components/Portfolio.test.jsx\`.

Expected: FAIL because the generated hatch is not rendered yet.

- [ ] **Step 3: Add card asset fields**

In \`src/data/portfolioCases.js\`, import both card WebPs and add \`card: catCafeCard\` to \`cat-cafe\` and \`card: darkChessCard\` to \`dark-chess\`. Do not change evidence \`items\`, metrics, or dialog copy.

- [ ] **Step 4: Render the hatch in \`Portfolio.jsx\`**

Import \`analysis-hatch-frame-v1.webp\`, change gallery item mapping to \`image: caseData.card\`, remove obsolete OGL tuning props, and use:

\`\`\`jsx
<img className="analysis-viewport__hatch" src={analysisHatchFrame} alt="" aria-hidden="true" />
<div className="analysis-viewport__gasket">
  <CircularGallery
    items={galleryItems}
    activeId={selectedId}
    onSelect={openCase}
    ariaLabel={work.viewportLabel}
    selectLabel={(item) => \`\${work.selectPrefix}\${item.text}\`}
  />
</div>
\`\`\`

Delete the old bezel, ticks, and glint markup.

- [ ] **Step 5: Simplify the frame CSS**

Replace old bezel/tick/glint rules with:

\`\`\`css
.analysis-viewport { position:relative; z-index:2; width:min(88vw,820px); aspect-ratio:1; margin-inline:auto; transition:filter 260ms ease,opacity 260ms ease; }
.analysis-viewport__hatch { position:absolute; z-index:2; inset:0; width:100%; height:100%; object-fit:contain; pointer-events:none; user-select:none; filter:drop-shadow(0 30px 60px rgba(0,0,0,.68)); }
.analysis-viewport__gasket { position:absolute; z-index:1; inset:15%; overflow:hidden; border-radius:50%; background:radial-gradient(circle at 50% 58%,rgba(44,138,154,.12),transparent 52%),#05090c; box-shadow:inset 0 0 60px rgba(0,0,0,.8); }
@media (max-width:760px) { .analysis-viewport { width:min(98vw,680px); } }
@media (max-width:430px) { .analysis-viewport { width:106vw; margin-left:-3vw; } .analysis-viewport__gasket { inset:14%; } }
\`\`\`

Keep the bay background, heading, note, and dimmed-dialog rules.

- [ ] **Step 6: Run focused tests**

Run:

\`\`\`powershell
npm test -- src/components/Portfolio.test.jsx src/components/CircularGallery.test.jsx src/data/portfolioCases.test.js
\`\`\`

Expected: all focused tests PASS.

- [ ] **Step 7: Commit the integration**

\`\`\`powershell
git add -- src/data/portfolioCases.js src/components/Portfolio.jsx src/components/Portfolio.css src/components/Portfolio.test.jsx
git commit -m "feat: install portfolio analysis hatch"
\`\`\`

---

### Task 4: Full verification and browser QA

**Files:**
- Modify only if QA reveals a requirement failure: \`src/components/CircularGallery.css\`, \`src/components/Portfolio.css\`

**Interfaces:**
- Consumes: completed \`/portfolio\`.
- Produces: verified desktop/mobile interaction and layout.

- [ ] **Step 1: Run all automated checks**

\`\`\`powershell
npm test
npm run lint
npm run build
\`\`\`

Expected: all three commands exit 0.

- [ ] **Step 2: Inspect desktop composition**

At approximately \`1046×698\`, confirm the full hatch is visible, the Cat Café card is central and dominant, Dark Chess recedes without clipping, both Logos are legible, and no detached selector boxes remain.

- [ ] **Step 3: Verify interactions**

Confirm direct click opens the correct case; Escape closes; focus returns to the clicked card; Left/Right changes centering without opening; horizontal drag/swipe changes centering; clicking the side card opens it directly.

- [ ] **Step 4: Inspect mobile layout**

At approximately \`390×844\`, confirm the central card stays inside the hatch, the side card remains discoverable, no horizontal page scroll appears, the plate text does not overflow, and both cards are tappable.

- [ ] **Step 5: Verify reduced motion**

Emulate \`prefers-reduced-motion: reduce\`; confirm card changes have no 3D rotation or travel.

- [ ] **Step 6: Apply only evidence-backed CSS corrections**

If QA exposes clipping or scale issues, change only the two scoped CSS files and repeat Steps 1–5. Do not change case copy or other stations.

- [ ] **Step 7: Commit QA corrections if needed**

\`\`\`powershell
git add -- src/components/CircularGallery.css src/components/Portfolio.css
git commit -m "fix: polish portfolio analysis viewport"
\`\`\`

