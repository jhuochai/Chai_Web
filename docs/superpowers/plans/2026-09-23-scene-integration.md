# Approved scene integration

The user approved integrating the remaining captain archive-room design and night docking-port landscape on 2026-09-23.

1. Generate and compress text-free scene plates matching the approved art. Keep real portrait, bilingual text, results and professional capabilities in HTML.
2. Replace the profile's ornamental bordered layout with a physical dossier stand in the archive room. Present the remaining profile content below the desk scene as readable, unboxed sections. Stack portrait and content on narrow screens.
3. Add the docking-port landscape behind the corrected arm. Keep foreground independent for recoil, preserve shot timing, keyboard operation and reduced motion. Put bright scenery away from the foreground arm to avoid blending artifacts.
4. Verify desktop/mobile composition, bilingual fit, existing profile/loading tests, complete test suite, lint and production build. Verify versioned download files are included in the output.
5. Inspect existing hosting information before any release; ask for the deployment destination if none is configured. Local integration proceeds independently.

No new runtime dependency. Preserve existing unrelated changes. Assets generated using built-in imagegen; prompts request navy archive room with warm shelf lamps and cleared central desk, and a restrained night docking port with distant right-side lights and calm left foreground.

## Delivered assets and prompt record

- `src/assets/scenes/captain-archive-room.webp` (146,352 bytes). Built-in imagegen, reference `exec-a1073863-e294-430e-986a-530b3c95933c.png`, output `exec-06619d1c-0668-4334-a1b5-8877319d8728.png`. Prompt: make a clean production environment plate from the approved mockup; remove the foreground board, portrait, stand, all typography and top navigation. Preserve navy brushed metal, warm amber shelf lights, left observation window/captain chair, right archive shelves and ship model, small brass instrument and notebooks. Clear calm central desk for responsive HTML. Readable midtones, no characters or UI.
- `src/assets/scenes/night-docking-port.webp` (67,096 bytes). Built-in imagegen output `exec-ba9e0f4b-5979-46d9-a5d3-2d02b4e05b9a.png`. Prompt: wide 16:9 hand-painted science-fiction night port, restrained navy/charcoal, distant city and parked ship concentrated in right third, subtle berth lights and ground reflections. Keep left two thirds very dark blue-black and upper sky quiet for separate gun and fireworks. No hands, weapon, explosion, typography, UI or borders; avoid neon overload and plastic CGI.

## Verification

- Targeted profile/loading/application tests: 25 passed.
- Full suite: 48 files / 255 tests passed.
- Production build passed; existing large-bundle advisory remains.
- Lint has no errors; the same pre-existing SmoothScroll and LanguageContext warnings remain.
- Browser checked Chinese and English at desktop width and 390px mobile width, no horizontal overflow. Confirmed profile stand, portrait, readable text and new loading landscape compositing.
- Both portable archives exist in `dist/downloads` at the documented sizes.
- No hosting configuration is present in the repository. Deployment destination was requested from the user; no public deployment was performed.
