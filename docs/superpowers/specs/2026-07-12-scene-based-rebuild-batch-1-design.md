# Scene-Based Rebuild — Batch 1 Design

## Background

The site was originally built today as a 4-module single-page app (Hero / About / Portfolio /
Contact) with a bilingual (EN default, ZH toggle) content system, a CircularGallery portfolio
carousel, a mailto-based message dialog, a click-spark micro-interaction, and a
VariableProximity hover effect on the hero name.

The user has now pivoted to a much larger direction: an 8-scene cinematic, scroll-driven
narrative site (Scene 0 loading → Scene 7 closing), using character illustrations and
background art she has already generated and placed in `設計參考/`. This is a full rebuild of
the page structure, not an incremental change, and is far too large for a single spec/plan
cycle. It is being decomposed into batches per the user's own proposed build order:

- **Batch 1** (this spec): scene skeleton for all 8 scenes + fully-built Scene 1 (Hero) and
  Scene 7 (Contact), reusing Scene 5 (Portfolio) as-is.
- **Batch 2** (future spec): Scene 0 loading sequence (gun/bullet/firework), Scene 2 hanging
  parallax intro, Scene 3 career tree (walk transition, day/night toggle, ribbon/flower
  hotspots).
- **Batch 3** (future spec): real content fill for Scenes 3/4/6, background music, floating
  companion character, cross-resolution polish.

Batch 1 is the only scope covered by this document.

## IP Risk Note (acknowledged, accepted by user)

The character illustrations in `設計參考/` (`character_lean.png`, `拿著槍的手.png`, and others)
are visually very close to Riot Games' Jinx character design, and `character_lean.png`'s jacket
graffiti includes literal "ZAUN MARKETING" text. This was surfaced explicitly to the user, who
chose to accept the risk and use the assets as-is for this personal portfolio site. No further
action is needed on this point; it is documented here for the record.

## Architecture

Continuous single-page vertical scroll, no scroll-snap. Eight `<section>` elements
(`#scene-0` … `#scene-7`) stacked inside one `<main>`, each `min-height: 100dvh`. Scroll-linked
reveals continue to use `motion/react` (already in use today), consistent with the existing
`RevealSection` pattern. GSAP ScrollTrigger is deliberately deferred to Batch 2, where Scene 3's
pinned day/night + walk-transition sequence actually needs it — introducing it now would mean
locking in an animation framework decision for scenes that haven't been designed yet.

App-level structure carries over unchanged: `LanguageProvider` → `LoadingScreen` (today's simple
version; the gun/bullet/firework Scene 0 sequence is Batch 2) → `ClickSpark` wrapping `Nav` +
`<main>`.

## Global changes

- **Nav**: upgrade to a glass-pill treatment. Desktop keeps inline scene links + language
  toggle + Contact Me. Mobile collapses to a glass hamburger button (Lucide-style crossfade
  icon rotation, ~300ms) opening a fullscreen glass overlay menu with staggered link entrance
  (100ms, 150ms, 200ms, … per link). To avoid an 8-item nav (fails the "single line on
  desktop" rule), the visible link set stays curated at three, re-pointed to the new anchors:
  Home → `#scene-1`, Story → `#scene-3` (the career-tree scene carries the experience
  narrative), Work → `#scene-5` (Portfolio). Scene 0/2/4/6/7 aren't in the nav itself; Scene 7
  stays reachable via the Contact Me button as today.
- **FramedPanel**: add a new frame treatment based on the Art Deco geometric reference the user
  shared (nested rectilinear gold linework, symmetric corner notches) — hand-authored original
  SVG, not traced from the reference image (itself a stock asset, used only as a style guide,
  same policy as the earlier `設計參考` mood images). This becomes the frame used for the Hero
  nameplate and echoed at Scene 7. It replaces today's minimalist corner-bracket variant for
  these two scenes; other frame usages (Portfolio cards) are untouched this batch.
- **Asset pipeline**: the character/scene PNGs in `設計參考/` are 4–10MB each (uncompressed
  exports). Before import, each image used in Batch 1 (currently `hero page_background.png`
  plus whichever full-bleed backgrounds the skeleton scenes use) is resized to a 2400px-long-edge
  cap (full-bleed backgrounds need headroom above 1920px viewports, but not the original
  export resolution) and re-compressed to WebP with a PNG fallback where transparency isn't
  needed, and moved into `src/assets/scenes/`. Images not used by any Batch 1 scene (character
  sprites, ribbon/flower hotspot art) are left in `設計參考/` untouched until their batch.

## Scene 1 — Hero (full build)

- Background: `hero page_background.png` (cyberpunk Starry Night skyline), single static
  image, `object-fit: cover`, `background: black` fallback under it while it loads. No video,
  no crossfade switcher — the multi-source crossfade pattern from the reference prompt the user
  supplied is explicitly deferred to Scene 3's day/night toggle (Batch 2), not used here.
- Badge pill above the headline (glass pill), reusing the existing `t.title` string (Game
  Marketing Coordinator / 遊戲行銷企劃) that already renders as small eyebrow text today — no
  new copy, just a pill treatment instead of a bare mono label.
- Nameplate: Art Deco geometric frame (see Global changes) wraps the name; today's
  VariableProximity hover effect on the name text carries over unchanged.
- Positioning statement carries over unchanged (bilingual, with the existing emphasized-phrase
  treatment).
- Bottom stats row pinned near the hero's bottom edge via a flex spacer: three real highlights
  (67% IG follower growth · GA Certified · 24 cross-format assets), `|`-separated, small caps,
  always parchment/white regardless of badge/frame state.
- No CTA or email-capture row in the Hero — confirmed explicitly by the user; Nav's Contact Me
  is the only CTA on the page.

## Scenes 0, 2, 3, 4, 6 — skeleton only this batch

Each is `min-height: 100dvh` with its real background image showing (compressed per the asset
pipeline above). Placeholder heading follows one convention in both languages: the scene's
working title plus a "content coming in a later pass" note (e.g. "Scene 3 — Career Tree /
content coming soon" · "第三幕：生涯大樹 / 內容製作中"), styled as plain centered text, no
attempt at final layout. No interactivity yet:

- Scene 0: no gun/bullet/firework sequence yet (today's simple LoadingScreen splash stays as
  the actual loading experience; Scene 0 as a scroll-section is just a placeholder shell for
  now — see open question below).
- Scene 2: no hanging-parallax character yet, just the background.
- Scene 3: no walk transition, no day/night toggle, no ribbon/flower hotspots yet.
- Scene 4: no interests content yet.
- Scene 6: no "how this was built" content yet.

The goal of this batch for these five scenes is purely to confirm the 1700px content column,
the vertical rhythm between scenes, and the scroll-anchor nav wiring — not to build their real
experience.

**Open question carried into the plan**: Scene 0 is described in the full brief as a
loading-screen replacement (gun/bullet/firework, blocking entry until triggered), not a normal
scrollable section. Batch 1 keeps today's `LoadingScreen` overlay as the actual entry
experience and adds an empty `#scene-0` anchor placeholder in the scroll flow only so the nav
numbering/anchors are stable for Batch 2 to fill in. This will be revisited when Scene 0's real
sequence is designed in Batch 2.

## Scene 5 — Portfolio (reuse, no changes)

Today's CircularGallery + case detail panels carry over unchanged, just re-anchored as
`#scene-5`.

## Scene 7 — Contact (full build)

Carries over today's closing section content (closing statement, email/resume/LinkedIn-
placeholder links, the mailto-based message dialog) unchanged, re-anchored as `#scene-7`, with
the Hero's Art Deco frame treatment echoed here (frame reuse, not a new design).

## Testing / verification

- Browser check per scene: correct background image loads, correct placeholder/real content
  shows, nav anchors scroll to the right section in both languages.
- Confirm hamburger menu open/close, staggered link entrance, focus handling.
- Confirm Hero badge/frame/stats row all render correctly in both languages and don't regress
  the existing VariableProximity hover effect or contrast (WCAG AA) on the stats row text.
- Confirm image payload sizes after compression are reasonable (target: each hero-sized image
  under ~400KB after resize/compress, down from the current 4-10MB source files).
- No console errors, no failed network requests, existing message-dialog and language-toggle
  flows still work.

## Out of scope (deferred to Batch 2 / Batch 3)

- Scene 0 real loading sequence (gun/bullet/firework, click-or-timer dual trigger).
- Scene 2 hanging-parallax character behavior.
- Scene 3 walk transition, leaf particles, day/night toggle, ribbon/flower hotspot cards.
- Scene 4 and Scene 6 real content.
- Background music system.
- Floating companion character (`character_lean.png` + `character_ribbon.png`) with
  cursor-reactive ribbon.
- Cross-resolution (1440/1700/1920) final polish pass for the new scenes.
