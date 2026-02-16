// Camera utility for computing viewport scroll with world-edge clamping

/**
 * Compute camera scroll position (in pixels) to keep the player centered
 * in the viewport, clamping at world edges to prevent showing empty space.
 * 
 * @param playerPx - Player position in pixels (e.g., playerX * TILE_SIZE)
 * @param worldPx - World dimension in pixels (e.g., WORLD_WIDTH * TILE_SIZE)
 * @param viewportPx - Viewport dimension in pixels
 * @returns Camera scroll position in pixels
 */
export function computeCameraScroll(
  playerPx: number,
  worldPx: number,
  viewportPx: number
): number {
  // If world fits entirely in viewport, no scrolling needed
  if (worldPx <= viewportPx) {
    return 0;
  }

  // Center the player in the viewport
  const centered = playerPx - viewportPx / 2;

  // Clamp to world edges
  const minScroll = 0;
  const maxScroll = worldPx - viewportPx;

  return Math.max(minScroll, Math.min(maxScroll, centered));
}
