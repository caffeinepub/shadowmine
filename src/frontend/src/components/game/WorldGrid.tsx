import { useState, useEffect, useCallback, useRef } from 'react';
import { generateWorld } from '../../game/world';
import { handleTileClick, handleBlockPlacement, isTileRevealed } from '../../game/mining';
import { Tile } from './Tile';
import { TouchControls } from './TouchControls';
import type { WorldGrid as WorldGridType, Position, BlockType } from '../../game/types';
import type { InventoryCounts } from '../../game/inventory';
import { TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, JUMP_HEIGHT, GRAVITY_TICK_MS } from '../../game/constants';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';
import { computeCameraScroll } from '../../game/camera';

interface WorldGridProps {
  onBlockMined?: (blockType: BlockType) => void;
  onBlockPlaced?: (blockType: 'dirt' | 'stone') => void;
  selectedBlock: 'dirt' | 'stone' | null;
  inventory: InventoryCounts;
}

export function WorldGrid({ onBlockMined, onBlockPlaced, selectedBlock, inventory }: WorldGridProps) {
  const [world, setWorld] = useState<WorldGridType>(() => generateWorld());
  
  // Player starts at the center of the starting air pocket
  const [playerPos, setPlayerPos] = useState<Position>({
    x: Math.floor(WORLD_WIDTH / 2),
    y: 2,
  });

  // Jump state: tracks remaining upward movement in a jump
  const [jumpRemaining, setJumpRemaining] = useState(0);
  const jumpRemainingRef = useRef(0);

  // Horizontal movement state: track which keys are held
  const keysHeld = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Viewport and camera state
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ width: 800, height: 600 });

  // Detect touch device
  const isTouch = useIsTouchDevice();

  // Track viewport size
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateSize = () => {
      setViewportSize({
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      });
    };

    // Initial size
    updateSize();

    // Watch for resize
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(viewport);

    return () => resizeObserver.disconnect();
  }, []);

  // Compute camera position
  const worldWidthPx = WORLD_WIDTH * TILE_SIZE;
  const worldHeightPx = WORLD_HEIGHT * TILE_SIZE;
  const playerXPx = playerPos.x * TILE_SIZE;
  const playerYPx = playerPos.y * TILE_SIZE;

  const cameraX = computeCameraScroll(playerXPx, worldWidthPx, viewportSize.width);
  const cameraY = computeCameraScroll(playerYPx, worldHeightPx, viewportSize.height);

  const onTileClick = (x: number, y: number) => {
    const tile = world[y][x];
    
    // If clicking on air and a block is selected, try to place
    if (tile.type === 'air' && selectedBlock) {
      // Check if we have inventory
      if (inventory[selectedBlock] > 0) {
        setWorld((currentWorld) => {
          const result = handleBlockPlacement(currentWorld, x, y, selectedBlock);
          
          // If placement succeeded, notify parent to consume inventory
          if (result.placed && onBlockPlaced) {
            onBlockPlaced(selectedBlock);
          }
          
          return result.world;
        });
      }
    } else if (tile.type !== 'air') {
      // Otherwise, try to mine
      setWorld((currentWorld) => {
        const result = handleTileClick(currentWorld, x, y);
        
        // If a block was broken, notify parent
        if (result.blockBroken && onBlockMined) {
          onBlockMined(result.blockBroken);
        }
        
        return result.world;
      });
    }
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
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keysHeld.current.left = true;
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keysHeld.current.right = true;
          e.preventDefault();
          break;
        default:
          return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          keysHeld.current.left = false;
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          keysHeld.current.right = false;
          e.preventDefault();
          break;
        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerJump]);

  // Continuous horizontal movement based on held keys
  useEffect(() => {
    const moveInterval = setInterval(() => {
      const { left, right } = keysHeld.current;
      
      // If both or neither are pressed, don't move
      if (left === right) return;
      
      // Move in the direction of the held key
      if (left) {
        movePlayer(-1, 0);
      } else if (right) {
        movePlayer(1, 0);
      }
    }, 120); // Move every 120ms for smooth continuous movement

    return () => clearInterval(moveInterval);
  }, [movePlayer]);

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

  // Touch control handlers for continuous movement
  const handleTouchMoveLeft = useCallback(() => {
    movePlayer(-1, 0);
  }, [movePlayer]);

  const handleTouchMoveRight = useCallback(() => {
    movePlayer(1, 0);
  }, [movePlayer]);

  return (
    <div className="relative inline-block">
      {/* Viewport container with overflow hidden */}
      <div
        ref={viewportRef}
        className="relative overflow-hidden border-4 border-stone-800 shadow-2xl bg-black"
        style={{
          width: '800px',
          height: '600px',
        }}
      >
        {/* Camera-translated world layer */}
        <div
          className="absolute top-0 left-0"
          style={{
            transform: `translate(${-cameraX}px, ${-cameraY}px)`,
            width: `${worldWidthPx}px`,
            height: `${worldHeightPx}px`,
          }}
        >
          {/* World grid */}
          <div 
            className="inline-grid gap-0"
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
        </div>

        {/* Player marker in viewport coordinates */}
        <div
          className="absolute pointer-events-none transition-all duration-150 ease-out"
          style={{
            left: playerXPx - cameraX + 4,
            top: playerYPx - cameraY + 4,
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
      </div>

      {/* Touch controls - only visible on touch devices */}
      {isTouch && (
        <TouchControls
          onMoveLeft={handleTouchMoveLeft}
          onMoveRight={handleTouchMoveRight}
          onJump={triggerJump}
        />
      )}
    </div>
  );
}
