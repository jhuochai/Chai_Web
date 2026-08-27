# Recruiter Readability Content Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the approved cockpit and station world while making the profile, navigation, cases, AI room, and making-of content immediately understandable and credible to a game-marketing recruiter.

**Architecture:** Keep `content.js`, `stations.js`, and `portfolioCases.js` as the bilingual data sources, and let components render only fields that contain finished content. Replace the existing profile portrait asset without adding a second portrait region; add station-purpose labels as subordinate text rather than changing routes or Hero controls.

**Tech Stack:** React 19, Vite 8, Vitest, Testing Library, GSAP, CSS, WebP/PNG assets.

## Global Constraints

- Do not change Hero Page layout, cockpit art, four controls, copy, or interactions.
- Use Traditional Chinese for all Chinese UI copy.
- Keep AI Lab entry available; hide only the unfinished mini-app incubator and status.
- Do not invent Dark Chess spend, duration, thresholds, CPI, CTR, CVR, or IR values.
- Do not attribute 18k-to-30k growth to one person or one activity.
- Secondary station labels must be smaller and quieter than world-building names while remaining readable.
- Only the Captain's Office portrait may receive newly generated art.
- Preserve the user's untracked `史達普Stapu寵物/` source folder.

---

### Task 1: Add Recruiter-Readable Station Labels Without Touching Hero

**Files:**
- Modify: `src/data/stations.js`
- Modify: `src/components/RouteMap.jsx`
- Modify: `src/components/RouteMap.css`
- Modify: `src/components/RouteMap.test.jsx`
- Modify: `src/data/content.test.js`

**Interfaces:**
- Consumes: existing `STATIONS` entries and `station[lang]` world name.
- Produces: `station.purpose[lang]` for route-map subtitles; existing `route`, `next`, and Hero data stay unchanged.

- [ ] **Step 1: Write failing station-purpose tests**

Add assertions that every public station has a bilingual purpose and that the route map renders `Captain's Office` with `About me`, plus `艦長辦公室` with `關於我`. Preserve the existing assertion that Hero has four entries.

```jsx
expect(STATIONS.find(({ id }) => id === 'profile').purpose).toEqual({ zh: '關於我', en: 'About me' });
expect(screen.getByRole('button', { name: /Captain's Office About me/i })).toBeEnabled();
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --run src/data/content.test.js src/components/RouteMap.test.jsx`

Expected: FAIL because `purpose` and subtitle DOM do not exist.

- [ ] **Step 3: Add purpose data and subordinate markup**

Use these exact purpose labels:

```js
cockpit: { zh: '航行首頁', en: 'Home' }
profile: { zh: '關於我', en: 'About me' }
career-tree: { zh: '經歷與遊戲', en: 'Experience & games' }
portfolio: { zh: '行銷案例', en: 'Marketing cases' }
ai-lab: { zh: 'AI 協作與史達普', en: 'AI collaboration & Stapu' }
making-of: { zh: '網站製作過程', en: 'Website process' }
```

Render `.route-map__station-name` and `.route-map__station-purpose` inside one content wrapper. Style purpose at `0.72rem`, normal weight, lower-saturation parchment color, with no more than `0.04em` tracking. Give the separate communications button a subordinate `聯絡方式` / `Contact` label with the same hierarchy.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --run src/data/content.test.js src/components/RouteMap.test.jsx`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: clarify station purposes in route map`

### Task 2: Replace the Back-Facing Temporary Portrait and Strengthen About Me

**Files:**
- Create: `src/assets/scenes/captain-portrait-front.webp`
- Modify: `src/components/Intro.jsx`
- Modify: `src/components/Intro.css`
- Modify: `src/components/Intro.test.jsx`
- Modify: `src/data/content.js`
- Modify: `src/data/content.test.js`

**Interfaces:**
- Consumes: user-provided front-view character reference and the existing `.intro__portrait` slot.
- Produces: finished front portrait and a recruiter summary block linking to `/portfolio` through `navigateToRoute('/portfolio')`.

- [ ] **Step 1: Write failing profile tests**

Test that the profile includes the role, all three verified result groups, and a marketing-case action, while rendered text contains neither `TEMP`, `temporary`, `暫用`, nor the old slogan.

```jsx
expect(screen.getByText(/18k.*30k/i)).toBeInTheDocument();
expect(screen.getByText(/24.*26/)).toBeInTheDocument();
expect(screen.getByText(/3.*KOC/i)).toBeInTheDocument();
expect(screen.getByRole('button', { name: /marketing cases/i })).toBeEnabled();
expect(container).not.toHaveTextContent(/TEMP|temporary artwork|Aim on instinct/i);
```

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --run src/components/Intro.test.jsx src/data/content.test.js`

Expected: FAIL on summary, action, and temporary artwork copy.

- [ ] **Step 3: Generate and optimize the portrait**

Generate a front-facing head-and-chest portrait from the supplied reference: black-and-electric-blue braids, dark graffiti jacket, calm confident expression, painterly 2D line work with dimensional industrial-blue and warm-gold rim light, plain dark dossier background, no words, arrows, checkerboard, logos, or extra figure. Crop vertically for the current portrait slot and export to `captain-portrait-front.webp`.

- [ ] **Step 4: Replace portrait markup and remove temporary labels**

Import `captain-portrait-front.webp`, use descriptive bilingual alt text, replace dossier copy with `Captain dossier` / `艦長檔案`, and remove the figcaption placeholder. Add a recruiter summary using these facts:

```js
role: '遊戲行銷企劃'
positioning: '具社群內容企劃、玩家溝通與成效判讀實務經驗。'
results: ['任職期間 IG 追蹤 1.8 萬至 3 萬', '完成 24 組跨格式素材與 26 支腳本', '負責 3 組 KOC 合作洽談與腳本方向']
```

Use equivalent natural English, not literal slogan translation.

- [ ] **Step 5: Build the matte-gold frame**

Keep the existing portrait footprint. Implement an aged matte-gold outer bevel, a darker recessed inner bevel, restrained repeating embossed marks, and edge highlights with CSS pseudo-elements. Remove the `TEMP / ARTWORK` pseudo-element. Use square or minimally rounded corners; no glossy yellow gold.

- [ ] **Step 6: Run focused tests**

Run: `npm test -- --run src/components/Intro.test.jsx src/data/content.test.js`

Expected: PASS.

- [ ] **Step 7: Commit**

Commit: `feat: finish captain dossier portrait and summary`

### Task 3: Correct the 30k First-Post Image and Separate Second-Post Metrics

**Files:**
- Create: `src/assets/cases/cat-cafe/thirty-k-first.png`
- Modify: `src/data/catCafeCase.js`
- Modify: `src/data/portfolioCases.js`
- Modify: `src/data/catCafeCase.test.js`
- Modify: `src/data/portfolioCases.test.js`
- Modify: `src/components/CaseAnalysisDesk.jsx`
- Modify: `src/components/CaseAnalysisDesk.test.jsx`

**Interfaces:**
- Consumes: `作品集/260611_貓咪造咖_社群_video_三萬粉第一篇/三萬粉第一篇用圖.png`.
- Produces: first-post visual with explicit second-post performance disclosure; `learning` becomes optional and is not rendered when absent.

- [ ] **Step 1: Write failing disclosure and optional-section tests**

Assert that the Hero proof contains `第一篇主視覺` and `下列成效來自三萬粉系列第二篇`, contains no replacement promise, and all items omit `learning`. Add a component test verifying no Learning section appears when the field is absent.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --run src/data/catCafeCase.test.js src/data/portfolioCases.test.js src/components/CaseAnalysisDesk.test.jsx`

Expected: FAIL because the old asset disclosure and pending learning remain.

- [ ] **Step 3: Copy the exact supplied PNG and update data copy**

Copy the source image byte-for-byte to `thirty-k-first.png`. Use it for the first-post visual. Label the metrics as second-post performance in both languages, and use `任職期間` phrasing for follower growth.

- [ ] **Step 4: Remove pending learning data and conditionally render finished sections**

Delete `pendingLearning` and every generated `learning` field. Render the section only with:

```jsx
{activeItem.learning ? <section>...</section> : null}
```

- [ ] **Step 5: Run focused tests**

Run: `npm test -- --run src/data/catCafeCase.test.js src/data/portfolioCases.test.js src/components/CaseAnalysisDesk.test.jsx`

Expected: PASS.

- [ ] **Step 6: Commit**

Commit: `fix: align 30k visual and performance evidence`

### Task 4: Reword Career and Profile Claims Within Verifiable Role Boundaries

**Files:**
- Modify: `src/data/content.js`
- Modify: `src/data/content.test.js`

**Interfaces:**
- Consumes: existing bilingual profile, career ribbons, portfolio legacy copy, and metrics.
- Produces: natural bilingual resume copy with the same facts and no unsupported causality.

- [ ] **Step 1: Add failing content-audit assertions**

Serialize active bilingual content and assert it does not match:

```js
/\bsolo\b|\bowning\b|end to end|from zero|from 0 to 1|從0到1|獨立負責|帶動 IG|靠直覺瞄準|多線並行不掉球/i
```

Also assert the exact neutral growth phrase exists in both languages.

- [ ] **Step 2: Run test and confirm failure**

Run: `npm test -- --run src/data/content.test.js`

Expected: FAIL listing the existing inflated or slogan-style copy.

- [ ] **Step 3: Rewrite active copy**

Use `負責`, `主責`, `整理`, `提出建議`, `執行`, and `交由主管確認` according to context. Replace growth causality with `任職期間 IG 追蹤由 1.8 萬增至 3 萬`; replace English with `During the placement, Instagram followers increased from 18k to 30k.` Remove unsupported HR success-rate percentages unless a denominator is already present.

- [ ] **Step 4: Run focused tests**

Run: `npm test -- --run src/data/content.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `content: tighten claims and recruiter-facing language`

### Task 5: Hide Unfinished AI and Making-of Material

**Files:**
- Modify: `src/components/AiLab.jsx`
- Modify: `src/components/AiLab.test.jsx`
- Modify: `src/components/CollaboratorSeats.jsx`
- Modify: `src/components/MakingOf.jsx`
- Modify: `src/components/MakingOf.test.jsx`
- Modify: `src/data/content.js`
- Modify: `src/data/content.test.js`

**Interfaces:**
- Consumes: completed Stapu interaction, finished marketing skills, and any making-of timeline entry with real images.
- Produces: AI Lab with no incubator placeholder and Making-of with no empty evidence slots.

- [ ] **Step 1: Write failing visibility tests**

Assert the AI Lab contains no `.incubation-pod` or `Incubating/培育中`, and Skills lists exactly five recruiter-facing capabilities. Assert Making-of renders only entries where `images.length > 0`, with no question-mark portraits or pending text.

- [ ] **Step 2: Run tests and confirm failure**

Run: `npm test -- --run src/components/AiLab.test.jsx src/components/MakingOf.test.jsx src/data/content.test.js`

Expected: FAIL on incubator, internal skill names, pending collaborator text, and empty timeline slots.

- [ ] **Step 3: Remove unfinished UI and publish finished skills**

Remove `IncubationPod` from `AiLab`. Use these five skills:

```js
['社群內容企劃', 'Meta 成效判讀', 'KOC／KOL 協作', '玩家回饋整理', '基礎視覺與短影音製作']
```

Add the exact disclosure: `AI 用於初稿探索與資料整理；內容選擇、查證與最終判斷由本人完成。` Add a natural English equivalent.

- [ ] **Step 4: Filter unfinished archive entries and simplify collaborators**

Set `const publishedTimeline = makingOf.timeline.filter((entry) => entry.images?.length);` and render no open-slot fallback. Remove `pending`, `small`, and question-mark portrait nodes from collaborator records; retain names and honest collaboration roles only.

- [ ] **Step 5: Run focused tests**

Run: `npm test -- --run src/components/AiLab.test.jsx src/components/MakingOf.test.jsx src/data/content.test.js`

Expected: PASS.

- [ ] **Step 6: Commit**

Commit: `feat: publish only finished AI and making-of content`

### Task 6: Mechanical Audit, Full Verification, and Browser QA

**Files:**
- Modify only files identified by failing audit checks.

**Interfaces:**
- Consumes: completed Tasks 1-5.
- Produces: verified deployable branch with an unchanged Hero surface.

- [ ] **Step 1: Run prohibited-copy scan**

Run:

```powershell
rg -n "Pending:|待補|Reserved for|Self-description pending|Incubating|TEMP / ARTWORK|\bsolo\b|\bowning\b|end to end|獨立負責|靠直覺瞄準|多線並行不掉球" src
```

Expected: no public-source matches. Test fixture matches must also be updated to the finished contract.

- [ ] **Step 2: Run Impeccable detector on changed UI files**

Run the local `detect.mjs --json` against changed JSX and CSS files. Expected: no new absolute-ban findings.

- [ ] **Step 3: Run all automated verification**

Run: `npm test -- --run`

Expected: all tests pass.

Run: `npm run lint`

Expected: exit 0; pre-existing warnings may remain only if unrelated.

Run: `npm run build`

Expected: production build succeeds; existing chunk-size advisory is non-blocking.

- [ ] **Step 4: Verify Hero source and browser rendering are unchanged**

Confirm no staged diff exists in `src/components/Hero.jsx`, `src/components/Hero.css`, or `src/components/hero/`. Compare the cockpit at the same desktop viewport before and after.

- [ ] **Step 5: Browser QA in both languages**

Check desktop and mobile for `/profile`, route map, `/career-tree`, `/portfolio`, `/ai-lab`, `/making-of`, and Contact. Confirm keyboard focus, portrait crop, gold-frame hierarchy, small station subtitles, correct 30k disclosure, no empty sections, and no overflow.

- [ ] **Step 6: Commit final corrections**

Commit: `fix: complete recruiter readability QA`
