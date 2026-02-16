import { getRequiredHits } from './miningConfig';
import type { TileState, WorldGrid, BlockType } from './types';
import { WORLD_WIDTH, WORLD_HEIGHT } from './constants';

// Check if a tile is adjacent to air in the 4-neighborhood (up, down, left, right)
// Out-of-bounds is treated as air
export function isAdjacentToAir(world: WorldGrid, x: number, y: number): boolean {
  const neighbors = [
    { dx: 0, dy: -1 }, // up
    { dx: 0, dy: 1 },  // down
    { dx: -1, dy: 0 }, // left
    { dx: 1, dy: 0 },  // right
  ];

  for (const { dx, dy } of neighbors) {
    const nx = x + dx;
    const ny = y + dy;
    
    // Out-of-bounds counts as air
    if (nx < 0 || nx >= WORLD_WIDTH || ny < 0 || ny >= WORLD_HEIGHT) {
      return true;
    }
    
    // Check if neighbor is air
    if (world[ny][nx].type === 'air') {
      return true;
    }
  }
  
  return false;
}

// Check if a tile should be revealed (visible to the player)
// Air tiles are always revealed, solid tiles are revealed only if adjacent to air
export function isTileRevealed(world: WorldGrid, x: number, y: number): boolean {
  const tile = world[y][x];
  
  // Air is always revealed
  if (tile.type === 'air') {
    return true;
  }
  
  // Solid tiles are revealed only if adjacent to air
  return isAdjacentToAir(world, x, y);
}

export function mineTile(tile: TileState): TileState {
  if (tile.type === 'air' || tile.remainingHits <= 0) {
    return tile;
  }

  const newRemainingHits = tile.remainingHits - 1;

  if (newRemainingHits <= 0) {
    // Tile is fully mined, convert to air
    return {
      type: 'air',
      remainingHits: 0,
      maxHits: 0,
    };
  }

  return {
    ...tile,
    remainingHits: newRemainingHits,
  };
}

export interface MiningResult {
  world: WorldGrid;
  blockBroken?: BlockType; // Present only if a block was fully mined (solid -> air)
}

export function handleTileClick(
  world: WorldGrid,
  x: number,
  y: number
): MiningResult {
  const tile = world[y][x];
  
  // Cannot mine air
  if (tile.type === 'air') {
    return { world };
  }
  
  // Cannot mine tiles that are not revealed
  if (!isTileRevealed(world, x, y)) {
    return { world };
  }
  
  // Cannot mine tiles that are not adjacent to air
  if (!isAdjacentToAir(world, x, y)) {
    return { world };
  }
  
  // Store the original type (we know it's not air at this point)
  const originalType: 'dirt' | 'stone' = tile.type;
  
  const newWorld = world.map((row) => [...row]);
  const minedTile = mineTile(newWorld[y][x]);
  newWorld[y][x] = minedTile;
  
  // Check if the tile broke (solid -> air)
  const blockBroken = minedTile.type === 'air' ? originalType : undefined;
  
  return { world: newWorld, blockBroken };
}

// Helper to create a placed tile with proper mining stats
export function createPlacedTile(blockType: 'dirt' | 'stone'): TileState {
  const maxHits = getRequiredHits(blockType);
  return {
    type: blockType,
    remainingHits: maxHits,
    maxHits: maxHits,
  };
}

export interface PlacementResult {
  world: WorldGrid;
  placed: boolean; // true if placement succeeded
}

// Attempt to place a block at the given position
// Only succeeds if the target tile is air
export function handleBlockPlacement(
  world: WorldGrid,
  x: number,
  y: number,
  blockType: 'dirt' | 'stone'
): PlacementResult {
  const tile = world[y][x];
  
  // Can only place on air tiles
  if (tile.type !== 'air') {
    return { world, placed: false };
  }
  
  // Create new world with placed block
  const newWorld = world.map((row) => [...row]);
  newWorld[y][x] = createPlacedTile(blockType);
  
  return { world: newWorld, placed: true };
}
