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

## Review follow-up

- Added vertical pointer/touch approach handling with a 36px threshold: upward gestures advance toward the controls and downward gestures retreat. A tap does not count as a gesture.
- Pointer handling only prevents the gesture when approach progress can change. At either boundary it leaves default behavior untouched. Reduced motion still skips both wheel and pointer gesture handling.
- Incomplete gestures are cleared by `pointercancel`, `lostpointercapture`, window blur, and unmount cleanup.
- The compact breakpoint now retains a short, wrapping archive hint below the trash bin instead of hiding the only making-of label.
- Regression coverage includes gesture direction, tap threshold, boundary behavior, interruption cleanup, reduced motion, unmount listener cleanup, and the mobile visible-hint CSS contract.

## Second review follow-up

- Moved pointer gesture consumption from `pointerup` to a non-passive `pointermove` listener. The first threshold-crossing move that can change approach calls `preventDefault()` and commits exactly once; later moves in that consumed gesture remain consumed, while `pointerup` only clears state.
- Pointer moves aimed beyond the current 0/1 boundary are not prevented, so ordinary page scrolling remains available at the boundary. Tests now cover immediate move prevention, one-time state change, cancellation cleanup, boundary release, and listener teardown.
