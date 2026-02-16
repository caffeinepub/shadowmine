import { WORLD_WIDTH, WORLD_HEIGHT, DIRT_TO_STONE_ROW } from './constants';
import { getRequiredHits } from './miningConfig';
import type { WorldGrid, BlockType, TileState } from './types';

export function generateWorld(): WorldGrid {
  const world: WorldGrid = [];

  for (let y = 0; y < WORLD_HEIGHT; y++) {
    const row: TileState[] = [];
    for (let x = 0; x < WORLD_WIDTH; x++) {
      const blockType: BlockType = y < DIRT_TO_STONE_ROW ? 'dirt' : 'stone';
      const maxHits = getRequiredHits(blockType);
      
      row.push({
        type: blockType,
        remainingHits: maxHits,
        maxHits,
      });
    }
    world.push(row);
  }

  // Create a small starting air pocket for the player
  // Starting position will be near the top-center
  const startX = Math.floor(WORLD_WIDTH / 2);
  const startY = 2;
  
  // Create a 3x3 air pocket
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const x = startX + dx;
      const y = startY + dy;
      if (x >= 0 && x < WORLD_WIDTH && y >= 0 && y < WORLD_HEIGHT) {
        world[y][x] = {
          type: 'air',
          remainingHits: 0,
          maxHits: 0,
        };
      }
    }
  }

  return world;
}
