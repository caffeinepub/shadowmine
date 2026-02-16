// Client-side inventory types and helpers for hotbar-only inventory

import type { BlockType } from './types';

export interface InventoryCounts {
  dirt: number;
  stone: number;
}

export function createEmptyInventory(): InventoryCounts {
  return {
    dirt: 0,
    stone: 0,
  };
}

export function incrementBlockCount(
  inventory: InventoryCounts,
  blockType: BlockType
): InventoryCounts {
  if (blockType === 'air') {
    return inventory;
  }

  return {
    ...inventory,
    [blockType]: inventory[blockType] + 1,
  };
}
