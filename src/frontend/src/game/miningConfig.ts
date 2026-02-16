import type { BlockType } from './types';

// Single source of truth for mining difficulty
export const MINING_CONFIG: Record<BlockType, number> = {
  air: 0,
  dirt: 2,
  stone: 5,
};

export function getRequiredHits(blockType: BlockType): number {
  return MINING_CONFIG[blockType];
}
