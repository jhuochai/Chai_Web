# Moving Ship Task 4 Report

## Delivered

- Rebuilt the Hero as an industrial captain cockpit with a beveled ship window, rivets, glass reflection, grounded rear-view captain, physical destination controls, and a keyboard-accessible approach control.
- Moved formal Hero destinations to `/profile`, `/career-tree`, and `/portfolio`; AI Lab now announces its localized coming-soon state without navigation.
- Added native wheel approach behavior: upward wheel advances, downward wheel retreats, boundaries release normal scrolling, the listener cleans up on unmount, and reduced motion opens in the near/control state.
- Replaced the archive icon with a 44px-plus metal bin and a new pink/cyan monkey graffiti drawing made from local SVG markup. It links safely to `/making-of` and has a visible text hint.
- Reframed the profile station as the Captain's Office: a brushed-metal dossier board with an explicitly temporary artwork crop, captain naming, preserved profile copy, and the former Hero tagline.
- Added an inside-lid CollaboratorSeats archive entry for 阿居 / Codex and 克克 / Claude. Both state their collaboration role and a pending self-description; neither presents a portrait nor a quote.
- Preserved the five Making-of timeline entries and all existing route/transition contracts. LoadingScreen, ClickSpark, CareerTree, and Portfolio were not edited. No dependencies or bitmap assets were added.

## TDD evidence

- RED: `npm.cmd test -- src/components/Hero.test.jsx src/components/Intro.test.jsx src/components/MakingOf.test.jsx src/components/CollaboratorSeats.test.jsx` failed against the former Hero, Intro, and absent collaborator component.
- RED: `npm.cmd test -- src/data/content.test.js` failed because Hero labels and targets still described legacy hash destinations.
- GREEN: focused suite passed with 28 tests after implementation.

## Verification

- Focused Hero, Intro, MakingOf, CollaboratorSeats, and content suite: 28 passing tests.
- Route and transition integration suite: 41 passing tests.
- Lint for every touched source and test file: clean.
- Production build: successful. Vite continues to report the existing advisory that the combined client chunk exceeds 500 kB after minification.
- `git diff --check`: clean.
- Browser QA: checked 1280×720, 644×698, and 390×844. All cockpit controls and archive bin remained reachable, no horizontal overflow was observed, and the preview console contained no errors. The 390px Captain's Office dossier also fit without horizontal overflow.
