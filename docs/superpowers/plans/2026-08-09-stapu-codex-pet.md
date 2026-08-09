# 史達普Stapu Codex Pet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce, validate, package, and install 史達普Stapu as a Codex-compatible v2 animated pet based on the supplied orange-tabby kitten photograph.

**Architecture:** The Hatch Pet skill creates a manifest-driven run folder. Isolated ImageGen workers create one grounded visual job each; the parent copies approved results, runs deterministic extraction and atlas tools, coordinates semantic and blind QA, and installs only a fully passing 8×11 package.

**Tech Stack:** Codex built-in ImageGen, bundled Python and Pillow, Hatch Pet deterministic scripts, JSON manifests, PNG/WebP/GIF QA artifacts.

## Global Constraints

- Internal pet id: `stapu`; display name: `史達普Stapu`.
- Source: `C:\Users\any50\OneDrive\圖片\Meowwww\c078082c4423cda6216a7b4627c6eb52.jpg`.
- Style: compact soft 3D plush/toy kitten preserving orange tabby markings, pale muzzle and chest, huge dark eyes, pink nose, triangular ears, and short legs.
- No added props, text, scenery, shadows, glows, detached effects, speed lines, dust, visible guides, or identity drift.
- Cell size: `192×208`; final atlas: exactly `1536×2288`; `spriteVersionNumber: 2` is mandatory.
- ImageGen is the only visual generation layer; Hatch Pet scripts own all deterministic extraction, registration, chroma cleanup, assembly, and QA rendering.
- Packaging requires deterministic validation, three isolated blind direction reviews, 16 labeled semantic verdicts, continuity review, and independent final visual QA.

---

### Task 1: Prepare the run and canonical identity

**Files:**
- Consume: `docs/superpowers/specs/2026-08-09-stapu-codex-pet-design.md`
- Create: `output/hatch-pet/stapu/pet_request.json`
- Create: `output/hatch-pet/stapu/imagegen-jobs.json`
- Create: `output/hatch-pet/stapu/references/canonical-base.png`

**Interfaces:**
- Consumes: approved design and kitten photo.
- Produces: manifest, prompts, guides, and the identity reference required by every animation job.

- [ ] **Step 1: Prepare the run**

```powershell
$python = 'C:\Users\any50\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$skillDir = 'C:\Users\any50\.codex\skills\hatch-pet'
$runDir = 'C:\Users\any50\Downloads\履歷網站\output\hatch-pet\stapu'
& $python "$skillDir\scripts\prepare_pet_run.py" --pet-name '史達普Stapu' --description 'A soft plush orange-tabby kitten with huge dark eyes and a tiny upright begging pose.' --reference 'C:\Users\any50\OneDrive\圖片\Meowwww\c078082c4423cda6216a7b4627c6eb52.jpg' --output-dir $runDir --pet-notes 'Preserve warm orange tabby markings, pale muzzle and chest bib, huge dark round eyes, pink nose, triangular ears, short legs, and an endearing upright posture; no props.' --style-preset '3d-toy' --style-notes 'Soft plush-like 3D toy finish, simplified fur masses, crisp sprite-safe silhouette.' --force
```

Expected: exit `0`; run manifest, prompts, and layout guides exist.

- [ ] **Step 2: Generate and approve the base job**

Dispatch one isolated ImageGen worker with `prompts/base-pet.md` and the kitten photo as the identity reference. Copy the exact approved result to `decoded/base.png` and `references/canonical-base.png`; mark only `base` complete in the manifest with source path and UTC completion time.

- [ ] **Step 3: Verify the canonical file**

```powershell
Get-Item -LiteralPath "$runDir\references\canonical-base.png"
```

Expected: one non-empty PNG.

---

### Task 2: Generate and validate standard rows 0–8

**Files:**
- Create: nine state strips under `output/hatch-pet/stapu/decoded`
- Create: per-state frame reviews under `output/hatch-pet/stapu/qa/rows`
- Create: `output/hatch-pet/stapu/final/spritesheet.webp`
- Create: `output/hatch-pet/stapu/qa/contact-sheet.png`
- Create: motion GIFs under `output/hatch-pet/stapu/qa/previews`

**Interfaces:**
- Consumes: canonical base, manifest prompts, retry prompts, and layout guides.
- Produces: validated idle, running-right, running-left, waving, jumping, failed, waiting, running, and review animation rows.

- [ ] **Step 1: Generate `idle` and `running-right` concurrently**

Use one isolated ImageGen worker per job with every manifest-listed input. Copy and validate each selected strip before marking it complete.

- [ ] **Step 2: Validate every copied strip immediately**

```powershell
& $python "$skillDir\scripts\extract_strip_frames.py" --decoded-dir "$runDir\decoded" --output-dir "$runDir\qa\rows\$state\frames" --states $state --method auto
& $python "$skillDir\scripts\inspect_frames.py" --frames-root "$runDir\qa\rows\$state\frames" --json-out "$runDir\qa\rows\$state\review.json" --states $state --require-components
```

Expected: both commands exit `0`; the current state's review has no errors.

- [ ] **Step 3: Create `running-left` safely**

If mirroring preserves the kitten's markings and semantics, run the bundled derivation with `--confirm-appropriate-mirror`; otherwise generate the complete row independently. Do not mirror the whole strip.

- [ ] **Step 4: Generate the remaining rows with up to three workers**

Generate waving, jumping, failed, waiting, running, and review independently. Regenerate only a complete failing row; never substitute locally drawn frames.

- [ ] **Step 5: Assemble and review the intermediate atlas**

```powershell
& $python "$skillDir\scripts\extract_strip_frames.py" --decoded-dir "$runDir\decoded" --output-dir "$runDir\frames" --states all --method auto
& $python "$skillDir\scripts\inspect_frames.py" --frames-root "$runDir\frames" --json-out "$runDir\qa\review.json" --require-components
& $python "$skillDir\scripts\compose_atlas.py" --frames-root "$runDir\frames" --output "$runDir\final\spritesheet.png" --webp-output "$runDir\final\spritesheet.webp"
& $python "$skillDir\scripts\make_contact_sheet.py" "$runDir\final\spritesheet.webp" --output "$runDir\qa\contact-sheet.png"
& $python "$skillDir\scripts\render_animation_previews.py" --frames-root "$runDir\frames" --output-dir "$runDir\qa\previews"
```

Expected: no frame-review errors and no visible identity drift, clipping, forbidden effects, static idle, wrong direction, or reversed gait.

---

### Task 3: Approve cardinal look anchors

**Files:**
- Create: `output/hatch-pet/stapu/qa/look-mechanics.md`
- Create: `output/hatch-pet/stapu/decoded/look-cardinals.png`
- Create: `output/hatch-pet/stapu/decoded/look-anchors-approved.png`
- Create: `output/hatch-pet/stapu/qa/cardinal-anchors.json`

**Interfaces:**
- Consumes: canonical base and approved standard contact sheet.
- Produces: natural eye/head/ear mechanics and approved 000 up, 090 right, 180 down, and 270 left anchors.

- [ ] **Step 1: Record pet-specific mechanics**

Document that the eye globes and pupils lead, the head follows with restrained pitch/yaw, ears provide subtle follow-through, and torso, paws, and tail remain continuously registered.

- [ ] **Step 2: Generate the four-cardinal strip**

Use one isolated cardinal worker with the manifest prompt, look-mechanics note, canonical identity, standard contact sheet, and layout guide. Reject any ambiguous cardinal.

- [ ] **Step 3: Extract and compose anchors**

```powershell
$chromaKey = (Get-Content -LiteralPath "$runDir\pet_request.json" -Raw | ConvertFrom-Json).chroma_key.hex
& $python "$skillDir\scripts\extract_cardinal_anchors.py" --strip "$runDir\decoded\look-cardinals.png" --output-dir "$runDir\decoded\look-anchors" --chroma-key $chromaKey --json-out "$runDir\qa\cardinal-anchors.json"
& $python "$skillDir\scripts\compose_cardinal_anchor_strip.py" --anchors-dir "$runDir\decoded\look-anchors" --output "$runDir\decoded\look-anchors-approved.png"
```

Expected: deterministic clipping checks pass and all cardinals are unmistakable at normal pet size.

---

### Task 4: Generate and independently validate 16 look directions

**Files:**
- Create: `output/hatch-pet/stapu/decoded/look-row-9.png`
- Create: `output/hatch-pet/stapu/decoded/look-row-10.png`
- Create: `output/hatch-pet/stapu/qa/direction-semantics.json`
- Create: `output/hatch-pet/stapu/qa/direction-blind-validation.json`
- Create: `output/hatch-pet/stapu/qa/look-continuity.json`

**Interfaces:**
- Consumes: canonical base, standard contact sheet, approved cardinals, and row 9 as continuity evidence for row 10.
- Produces: two coherent gaze rows and deterministic, labeled, blind, and continuity evidence.

- [ ] **Step 1: Generate and register row 9**

Generate `000, 022.5, 045, 067.5, 090, 112.5, 135, 157.5` as one coherent ImageGen strip, then run `assemble_extended_atlas.py` in registration mode with the idle neutral cell, the run chroma key, and threshold `96`.

- [ ] **Step 2: Generate row 10 after row 9 passes**

Generate `180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5` as one coherent strip grounded in the approved cardinals and completed row 9. Repair hard failures by regenerating the entire containing row.

- [ ] **Step 3: Assemble and render direction QA**

Run `assemble_extended_atlas.py` with the registered row 9 and source row 10, then run `make_direction_qa_sheet.py`, `make_direction_blind_qa_sheet.py`, and `measure_direction_continuity.py` against `final/spritesheet-extended.webp`.

- [ ] **Step 4: Run three isolated blind reviewers**

Each fresh worker sees only `qa/direction-blind-pairs.png`. Save all three exact JSON verdict objects, combine with `combine_direction_blind_verdicts.py`, and validate against the hidden key with `validate_direction_blind_verdicts.py`.

Expected: `direction-blind-validation.json` has `ok: true`; cardinal ambiguity or mismatch blocks packaging.

- [ ] **Step 5: Record all 16 semantic verdicts**

An independent reviewer records `verdict`, `expected`, `observed`, and `reason` for every direction, including separate horizontal and vertical evidence for diagonals. No `fail` verdict may remain.

---

### Task 5: Finalize, validate, install, and clean

**Files:**
- Create: `output/hatch-pet/stapu/final/validation-extended.json`
- Create: `output/hatch-pet/stapu/qa/chroma-despill-extended.json`
- Create: `output/hatch-pet/stapu/qa/contact-sheet-extended.png`
- Create: `output/hatch-pet/stapu/qa/run-summary.json`
- Install: `C:\Users\any50\.codex\pets\stapu\pet.json`
- Install: `C:\Users\any50\.codex\pets\stapu\spritesheet.webp`

**Interfaces:**
- Consumes: complete extended atlas and all QA evidence.
- Produces: validated v2 package and retained review artifacts.

- [ ] **Step 1: Apply the one authoritative despill pass and v2 validation**

```powershell
& $python "$skillDir\scripts\despill_chroma_edges.py" "$runDir\final\spritesheet-extended.png" --output "$runDir\final\spritesheet-extended.png" --webp-output "$runDir\final\spritesheet-extended.webp" --chroma-key $chromaKey --json-out "$runDir\qa\chroma-despill-extended.json"
& $python "$skillDir\scripts\validate_atlas.py" "$runDir\final\spritesheet-extended.webp" --json-out "$runDir\final\validation-extended.json" --chroma-key $chromaKey --require-v2
& $python "$skillDir\scripts\make_contact_sheet.py" "$runDir\final\spritesheet-extended.webp" --output "$runDir\qa\contact-sheet-extended.png"
```

Expected: despill has `ok: true`; validation confirms `1536×2288`, non-empty used cells, transparent unused cells, and no opaque chroma violations.

- [ ] **Step 2: Run independent final visual QA**

The reviewer receives both contact sheets, direction sheet, preview GIFs, semantic JSON, blind validation, continuity report, frame review, and v2 validation. Required result: `visual_qa=pass` and `repair_rows=none`.

- [ ] **Step 3: Install the package**

Create `C:\Users\any50\.codex\pets\stapu`, copy the final WebP, and create:

```json
{
  "id": "stapu",
  "displayName": "史達普Stapu",
  "description": "A soft plush orange-tabby kitten with huge dark eyes and a tiny upright begging pose.",
  "spriteVersionNumber": 2,
  "spritesheetPath": "spritesheet.webp"
}
```

- [ ] **Step 4: Write the run summary and retain required QA artifacts**

Keep the request, final WebP and validation, chroma report, extended contact sheet, direction sheet, semantics, blind QA files, continuity report, preview GIFs, frame review, and run summary. Remove intermediates only after successful installation.

- [ ] **Step 5: Verify the installed pair**

```powershell
Get-Item -LiteralPath 'C:\Users\any50\.codex\pets\stapu\pet.json','C:\Users\any50\.codex\pets\stapu\spritesheet.webp'
Get-Content -LiteralPath 'C:\Users\any50\.codex\pets\stapu\pet.json' -Raw | ConvertFrom-Json | Select-Object id,displayName,spriteVersionNumber,spritesheetPath
```

Expected: both files exist and report `stapu`, `史達普Stapu`, version `2`, and `spritesheet.webp`.
