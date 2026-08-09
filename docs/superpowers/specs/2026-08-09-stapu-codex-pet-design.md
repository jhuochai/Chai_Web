# 史達普Stapu Codex Pet Design

## Goal

Create a Codex-compatible v2 animated pet named **史達普Stapu**, grounded in the supplied orange-tabby kitten photograph.

## Visual identity

史達普Stapu is a compact soft 3D plush/toy kitten. Preserve the reference kitten's warm orange tabby coat, pale muzzle and chest bib, very large dark round eyes, small pink nose, triangular ears with pink interiors, short legs, and endearing upright begging posture. The pet should read clearly inside a 192×208 cell without added clothing, tools, text, or decorative props.

The face and markings remain consistent across every animation. Fur is simplified into soft plush-like shapes with crisp sprite-safe edges; it must not become photorealistic, long-haired, or visually noisy.

## Motion design

The standard animation rows are idle, running right, running left, waving, jumping, failed, waiting for input, active task work, and review. Motion comes from the kitten's paws, head, ears, torso, legs, and tail. Effects, shadows, scenery, speed lines, and detached symbols are excluded.

The 16 look directions form one clockwise motion family. 史達普Stapu's pupils and eye globes lead, the head follows with small yaw or pitch, ears add restrained follow-through, and the torso and paws remain stably registered. The four cardinal directions must be unmistakable at normal pet size.

## Production and packaging

Use the supplied photograph as the identity reference and the Hatch Pet image-generation workflow for the base image and coherent animation strips. Deterministic tools will extract frames, normalize geometry, remove the chroma key, assemble the 1536×2288 atlas, render QA artifacts, and validate the v2 package.

The final package contains `pet.json` with `spriteVersionNumber: 2` and `spritesheet.webp`. Packaging is allowed only after frame validation, motion previews, cardinal and blind direction checks, direction semantics review, continuity review, despill validation, and independent final visual QA pass.

## Success criteria

- 史達普Stapu remains recognizably the same orange-tabby kitten in all 11 rows.
- All required animation states communicate their intended Codex behavior.
- The 16 gaze directions are ordered correctly and the four cardinals are unambiguous.
- The atlas is exactly 1536×2288 with clean transparency and no forbidden effects.
- The installed custom-pet package is complete and uses sprite version 2.
