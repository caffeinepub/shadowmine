# Specification

## Summary
**Goal:** Add a hotbar-only inventory and automatically collect mined blocks into it.

**Planned changes:**
- Add a visible hotbar UI to the main gameplay screen showing dirt and stone with numeric counts (starting at 0) styled to match the existing stone/amber mining UI and positioned to avoid blocking the world grid or touch controls.
- Update mining resolution so that when a tile fully breaks (solid block becomes air), exactly 1 of that block type is immediately added to the hotbar counts (no pickup step), while partial damage and invalid clicks do not change counts.
- Update in-game English HUD text to state that mined blocks automatically go straight into the hotbar, keeping existing movement/mining instructions readable and accurate.

**User-visible outcome:** During gameplay, players see a hotbar with dirt/stone counts that increase instantly when a block is fully mined, and the HUD explains that mined blocks are auto-collected into the hotbar.
