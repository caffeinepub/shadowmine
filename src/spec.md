# Specification

## Summary
**Goal:** Update Shadow Mine movement inputs so Left/Right are continuous while held, Up is jump-only, and Down input is removed across keyboard, touch UI, and HUD instructions.

**Planned changes:**
- Change keyboard handling so holding ArrowLeft/ArrowRight continuously moves the player horizontally; releasing stops movement; pressing the opposite direction reverses immediately while still respecting collisions, boundaries, and existing camera follow behavior.
- Update ArrowUp to trigger jump only (no vertical step movement) and remove any ArrowDown/S movement behavior.
- Update touch controls UI to remove the Down control and ensure only Left, Right, and Jump inputs are available and wired.
- Update in-game HUD movement instructions (English) to reflect: Left/Right move, Up jumps, and no Down control.

**User-visible outcome:** Players can hold Left/Right to walk continuously, press Up to jump when grounded, and Down/S no longer does anything; on touch devices the Down button is gone and the HUD instructions match the new controls.
