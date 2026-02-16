// World generation and sizing constants

export const WORLD_WIDTH = 30;
export const WORLD_HEIGHT = 25;

// Row where dirt transitions to stone (0-indexed from top)
export const DIRT_TO_STONE_ROW = 8;

// Tile size in pixels for rendering
export const TILE_SIZE = 32;

// Jump and gravity constants
export const JUMP_HEIGHT = 3; // Number of tiles the player can jump
export const GRAVITY_TICK_MS = 100; // How often gravity pulls the player down (milliseconds)
