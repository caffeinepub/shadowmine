import { memo } from 'react';
import type { TileState } from '../../game/types';
import { TILE_SIZE } from '../../game/constants';

interface TileProps {
  tile: TileState;
  x: number;
  y: number;
  isRevealed: boolean;
  onClick: (x: number, y: number) => void;
}

function TileComponent({ tile, x, y, isRevealed, onClick }: TileProps) {
  const handleClick = () => {
    if (tile.type !== 'air' && isRevealed) {
      onClick(x, y);
    }
  };

  const progress = tile.maxHits > 0 
    ? ((tile.maxHits - tile.remainingHits) / tile.maxHits) * 100 
    : 0;

  // If not revealed, render as black fog
  if (!isRevealed) {
    return (
      <div
        className="relative border border-black bg-black cursor-default"
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
        }}
      />
    );
  }

  // Base styles for each block type
  const getBlockStyles = () => {
    switch (tile.type) {
      case 'air':
        return 'bg-black border-black cursor-default';
      case 'dirt':
        return 'bg-amber-800 border-amber-900 hover:brightness-110 cursor-pointer transition-all';
      case 'stone':
        return 'bg-slate-600 border-slate-700 hover:brightness-110 cursor-pointer transition-all';
      default:
        return 'bg-black border-black';
    }
  };

  // Cracking overlay based on damage
  const getCrackingOverlay = () => {
    if (tile.type === 'air' || progress === 0) return null;

    const opacity = Math.min(progress / 100, 0.7);
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 40%, rgba(0,0,0,${opacity}) 50%, transparent 60%)`,
        }}
      />
    );
  };

  return (
    <div
      className={`relative border ${getBlockStyles()}`}
      style={{
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      onClick={handleClick}
    >
      {getCrackingOverlay()}
      
      {/* Mining progress indicator */}
      {tile.type !== 'air' && progress > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
          <div
            className="h-full bg-yellow-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export const Tile = memo(TileComponent);
