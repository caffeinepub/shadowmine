import { useState, useCallback } from 'react';
import { WorldGrid } from '../components/game/WorldGrid';
import { Hud } from '../components/game/Hud';
import { Hotbar } from '../components/game/Hotbar';
import { createEmptyInventory, incrementBlockCount, decrementBlockCount } from '../game/inventory';
import type { InventoryCounts } from '../game/inventory';
import type { BlockType } from '../game/types';

export default function GameScreen() {
  const [inventory, setInventory] = useState<InventoryCounts>(createEmptyInventory());
  const [selectedBlock, setSelectedBlock] = useState<'dirt' | 'stone' | null>(null);

  const handleBlockMined = useCallback((blockType: BlockType) => {
    setInventory((current) => incrementBlockCount(current, blockType));
  }, []);

  const handleBlockPlaced = useCallback((blockType: 'dirt' | 'stone') => {
    setInventory((current) => decrementBlockCount(current, blockType));
  }, []);

  const handleSelectBlock = useCallback((blockType: 'dirt' | 'stone') => {
    // Toggle selection: if already selected, deselect; otherwise select
    setSelectedBlock((current) => (current === blockType ? null : blockType));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-black flex flex-col items-center justify-start p-8 gap-6 pt-20">
      <Hotbar 
        inventory={inventory} 
        selectedBlock={selectedBlock}
        onSelectBlock={handleSelectBlock}
      />
      
      <Hud />
      
      <main className="flex flex-col items-center gap-4">
        <WorldGrid 
          onBlockMined={handleBlockMined}
          onBlockPlaced={handleBlockPlaced}
          selectedBlock={selectedBlock}
          inventory={inventory}
        />
      </main>

      <footer className="mt-auto pt-8 text-center text-stone-500 text-sm">
        <p>
          © {new Date().getFullYear()} · Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'shadow-mine'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-500 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
