// Core game types for the 2D mining world

export type BlockType = 'air' | 'dirt' | 'stone';

export interface TileState {
  type: BlockType;
  remainingHits: number;
  maxHits: number;
}

export interface Position {
  x: number;
  y: number;
}

export type WorldGrid = TileState[][];
