import { useState, useEffect, useCallback, useRef } from 'react';
import { generateWorld } from '../../game/world';
import { handleTileClick, isTileRevealed } from '../../game/mining';
import { Tile } from './Tile';
import { TouchControls } from './TouchControls';
import type { WorldGrid as WorldGridType, Position, BlockType } from '../../game/types';
import { TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, JUMP_HEIGHT, GRAVITY_TICK_MS } from '../../game/constants';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface WorldGridProps {
  onBlockMined?: (blockType: BlockType) => void;
}

export function WorldGrid({ onBlockMined }: WorldGridProps) {
  const [world, setWorld] = useState<WorldGridType>(() => generateWorld());
  
  // Player starts at the center of the starting air pocket
  const [playerPos, setPlayerPos] = useState<Position>({
    x: Math.floor(WORLD_WIDTH / 2),
    y: 2,
  });

  // Jump state: tracks remaining upward movement in a jump
  const [jumpRemaining, setJumpRemaining] = useState(0);
  const jumpRemainingRef = useRef(0);

  // Detect touch device
  const isTouch = useIsTouchDevice();

  const onTileClick = (x: number, y: number) => {
    setWorld((currentWorld) => {
      const result = handleTileClick(currentWorld, x, y);
      
      // If a block was broken, notify parent
      if (result.blockBroken && onBlockMined) {
        onBlockMined(result.blockBroken);
      }
      
      return result.world;
    });
  };

  // Check if a position is valid for the player to move to
  const canMoveTo = useCallback((x: number, y: number): boolean => {
    // Out of bounds
    if (x < 0 || x >= WORLD_WIDTH || y < 0 || y >= WORLD_HEIGHT) {
      return false;
    }
    
    // Can only move into air tiles
    return world[y][x].type === 'air';
  }, [world]);

  // Check if player is grounded (has a non-air tile directly below)
  const isGrounded = useCallback((): boolean => {
    const belowY = playerPos.y + 1;
    
    // At bottom of world = grounded
    if (belowY >= WORLD_HEIGHT) {
      return true;
    }
    
    // Check if tile below is non-air
    return world[belowY][playerPos.x].type !== 'air';
  }, [playerPos, world]);

  // Attempt to move player in a direction
  const movePlayer = useCallback((dx: number, dy: number) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    if (canMoveTo(newX, newY)) {
      setPlayerPos({ x: newX, y: newY });
    }
  }, [playerPos, canMoveTo]);

  // Trigger a jump
  const triggerJump = useCallback(() => {
    // Can only jump if grounded and not already jumping
    if (isGrounded() && jumpRemainingRef.current === 0) {
      setJumpRemaining(JUMP_HEIGHT);
      jumpRemainingRef.current = JUMP_HEIGHT;
    }
  }, [isGrounded]);

  // Handle keyboard input for player movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          triggerJump();
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer(0, 1);
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer(-1, 0);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer(1, 0);
          e.preventDefault();
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, triggerJump]);

  // Jump mechanics: move player upward while jump is active
  useEffect(() => {
    if (jumpRemaining <= 0) return;

    const jumpInterval = setInterval(() => {
      setJumpRemaining((current) => {
        if (current <= 0) return 0;
        
        // Try to move up one tile
        const newY = playerPos.y - 1;
        if (canMoveTo(playerPos.x, newY)) {
          setPlayerPos((pos) => ({ ...pos, y: newY }));
          jumpRemainingRef.current = current - 1;
          return current - 1;
        } else {
          // Hit ceiling, cancel jump
          jumpRemainingRef.current = 0;
          return 0;
        }
      });
    }, 80); // Jump moves faster than gravity

    return () => clearInterval(jumpInterval);
  }, [jumpRemaining, playerPos.x, canMoveTo]);

  // Gravity: pull player down when not grounded and not jumping
  useEffect(() => {
    const gravityInterval = setInterval(() => {
      // Only apply gravity if not jumping
      if (jumpRemainingRef.current > 0) return;
      
      // Check if there's air below
      const belowY = playerPos.y + 1;
      if (belowY < WORLD_HEIGHT && world[belowY][playerPos.x].type === 'air') {
        setPlayerPos((pos) => ({ ...pos, y: belowY }));
      }
    }, GRAVITY_TICK_MS);

    return () => clearInterval(gravityInterval);
  }, [playerPos, world]);

  // Sync ref with state
  useEffect(() => {
    jumpRemainingRef.current = jumpRemaining;
  }, [jumpRemaining]);

  return (
    <div className="relative inline-block">
      <div 
        className="inline-grid gap-0 border-4 border-stone-800 shadow-2xl bg-black"
        style={{
          gridTemplateColumns: `repeat(${WORLD_WIDTH}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${WORLD_HEIGHT}, ${TILE_SIZE}px)`,
        }}
      >
        {world.map((row, y) =>
          row.map((tile, x) => {
            const revealed = isTileRevealed(world, x, y);
            return (
              <Tile
                key={`${x}-${y}`}
                tile={tile}
                x={x}
                y={y}
                isRevealed={revealed}
                onClick={onTileClick}
              />
            );
          })
        )}
      </div>
      
      {/* Player marker */}
      <div
        className="absolute pointer-events-none transition-all duration-150 ease-out"
        style={{
          left: playerPos.x * TILE_SIZE + 4,
          top: playerPos.y * TILE_SIZE + 4,
          width: TILE_SIZE - 8,
          height: TILE_SIZE - 8,
        }}
      >
        {/* Simple stick figure */}
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))' }}
        >
          {/* Head */}
          <circle cx="12" cy="6" r="3" fill="#FFD700" stroke="#000" strokeWidth="0.5" />
          
          {/* Body */}
          <line x1="12" y1="9" x2="12" y2="16" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          
          {/* Arms */}
          <line x1="12" y1="11" x2="8" y2="13" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="11" x2="16" y2="13" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          
          {/* Legs */}
          <line x1="12" y1="16" x2="9" y2="21" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="16" x2="15" y2="21" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Touch controls - only visible on touch devices */}
      {isTouch && (
        <TouchControls
          onMoveLeft={() => movePlayer(-1, 0)}
          onMoveRight={() => movePlayer(1, 0)}
          onMoveDown={() => movePlayer(0, 1)}
          onJump={triggerJump}
        />
      )}
    </div>
  );
}
