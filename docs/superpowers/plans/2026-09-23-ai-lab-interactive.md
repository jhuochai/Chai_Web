# AI Lab Interactive Showcase Implementation Plan

**Goal:** Deliver the approved spacecraft lab with two working embedded product demonstrations.
**Architecture:** AiLab owns the selected project and modal origin. ProjectDialog owns accessible expansion/return, reset and detail/download views. LivestreamDemo and LyricsDemo own independent in-memory sample state. Generated room art is a compressed asset; HTML devices and actions remain responsive.
**Tech Stack:** Existing React 19, motion/react, Vitest, Testing Library, Vite and sharp. No new runtime dependency.

## Constraints
- Preserve unrelated ChapterTransition edits and user files.
- Retain bilingual navigation and pet; move professional capabilities into the profile per the latest user instruction.
- Do not deploy or publish binaries as part of this local implementation.
- No ornamental outer frames, fake rivets or generated text in scene background.

## Tasks
- [x] 1. Add AiLab interaction tests for launch/return, task creation and reset, lyric controls and keyboard containment. Run `npm test -- src/components/AiLabInteractions.test.jsx --maxWorkers=1`; expect missing launch controls before implementation.
- [x] 2. Implement `ai-lab/ProjectDialog.jsx`, `LivestreamDemo.jsx`, `LyricsDemo.jsx`, `projects.js`, and `ProjectDemo.css`. Consume `project`, `lang`, `onClose`, `origin`, `returnFocus`; keep demo components free of account/network APIs. Reset via subtree key. Tests must confirm no localStorage demo writes.
- [x] 3. Replace `AiLab.jsx` room layout and `AiLab.css`, retain the pet panel and move capabilities to the profile. Add room and screenshot WebP assets. Bilingual labels, real monitor controls, making-of and downloads. Use an accessible dialog with Tab trapping, Escape, background inert and return focus.
- [x] 4. Prepare versioned portable archives from existing packaged applications only; inspect archive filenames for personal data/credentials. Document reconstruction/source paths and sizes in release notes. Keep binaries out of git per existing policy.
- [x] 5. Run targeted tests then `npm test -- --maxWorkers=1`, `npm run lint`, `npm run build`. Inspect desktop/mobile screenshots and test browser launch/close/input/resize. Request independent code review of accessibility, modal lifecycle and demo state. Fix material findings and rerun affected checks.

## Review focus
Dialog focus cannot escape into the inert page or reset when typing. Range, checkbox and input controls participate in the trap. Timers and pointer capture clean up. Reopening resets demo state; no user content is persisted or exposed. Asset URLs work with Vite base paths. Download instructions distinguish portable Windows builds from the web demonstration and unpublished hosting.

## Validation outcome

- Full suite: 48 files, 255 tests passed.
- Production build passed; existing bundle size advisory remains.
- Lint: no errors, two pre-existing warnings in SmoothScroll and LanguageContext.
- Independent review fixes: task editing, state retention across project tabs, lyric overlay reclamping when translated content changes size. Regression tests passed.
- Browser checks: desktop opening/return, 390px mobile task entry, lyric translation/movement, no horizontal overflow, profile capability placement, corrected loading hand compositing.
- Both local ZIP endpoints returned 200 and expected sizes. See docs/ai-lab-local-release.md.
- User requested richer hand materials and corrected arm direction; applied the new textured art. Night docking-port scenery remains a proposal.
