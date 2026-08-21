# Hero Layered Cockpit Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce two visually compatible Hero preview assets: an empty cockpit background and a solid steel control console with a transparent surrounding canvas.

**Architecture:** The Hero visual is split into a wide background layer and a foreground console layer. Both assets share the same centered camera, lighting, palette, and vanishing point so the website can animate them as one camera move.

**Tech Stack:** Built-in ImageGen, local image inspection, React/Vite asset pipeline after approval.

## Global Constraints

- Hero contains no character.
- Initial state shows only the empty cockpit and window view.
- Final state reserves approximately the upper two-thirds for the window and the lower one-third for the console.
- Console body is opaque solid steel; only the image area around it is transparent.
- No text, logo, watermark, floating cards, or four separate machinery blocks.
- This plan produces preview assets only; website integration waits for user approval.

---

### Task 1: Empty Cockpit Background Preview

**Files:**
- Reference: `hero page/環繞空間參考圖.png`
- Create: `src/assets/scenes/hero-empty-cockpit-v2.png`

**Interfaces:**
- Consumes: the supplied cockpit reference for architecture, camera, materials, and lighting.
- Produces: one wide raster background with no foreground console or character.

- [ ] **Step 1: Generate the empty cockpit**

  Generate a wide, front-facing industrial spacecraft cockpit. Preserve the reference's dark steel Arcane-like mechanical vocabulary and panoramic window. Remove the foreground console, chairs, character, text, and floating controls. Leave clear floor space in the lower third for the later foreground layer.

- [ ] **Step 2: Inspect the generated image**

  Verify that the window dominates the image, the lower third is usable floor space, the camera is centered, and no character or console remains.

- [ ] **Step 3: Save the selected preview**

  Copy the selected output to `src/assets/scenes/hero-empty-cockpit-v2.png` without overwriting the current Hero asset.

### Task 2: Solid Steel Console Preview

**Files:**
- Reference: `hero page/環繞空間參考圖.png`
- Create: `src/assets/props/hero-steel-console-v2.png`

**Interfaces:**
- Consumes: Task 1's centered camera, vanishing point, lighting, and the supplied cockpit reference.
- Produces: one wide opaque steel console on a genuinely transparent surrounding canvas.

- [ ] **Step 1: Generate the foreground console**

  Generate a continuous steel control console viewed from slightly above. It spans nearly the full width, has a mildly tilted instrument surface, visible front-edge thickness, structural supports, dark worn steel, rivets, seams, restrained brass details, and cool-blue indicators. Keep four small functional mounting zones integrated into the same surface; do not create four separate blocks.

- [ ] **Step 2: Inspect material and transparency**

  Verify that the console itself is fully opaque and reads as steel, the surrounding canvas has actual alpha transparency, and no text, logo, watermark, character, or background room appears.

- [ ] **Step 3: Save the selected preview**

  Copy the selected output to `src/assets/props/hero-steel-console-v2.png` without overwriting existing control assets.

### Task 3: Present the Pair for Approval

**Files:**
- Inspect: `src/assets/scenes/hero-empty-cockpit-v2.png`
- Inspect: `src/assets/props/hero-steel-console-v2.png`

**Interfaces:**
- Consumes: the two preview assets.
- Produces: a user-visible side-by-side decision point before any website integration.

- [ ] **Step 1: Display both previews**

  Show the background and console separately, clearly labeled.

- [ ] **Step 2: Record approval or one targeted revision**

  If either asset is rejected, change only the named mismatch and regenerate that asset. Do not integrate until both are approved.
