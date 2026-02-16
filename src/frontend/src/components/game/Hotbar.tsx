import { Package } from 'lucide-react';
import type { InventoryCounts } from '../../game/inventory';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

interface HotbarProps {
  inventory: InventoryCounts;
  selectedBlock: 'dirt' | 'stone' | null;
  onSelectBlock: (blockType: 'dirt' | 'stone') => void;
}

export function Hotbar({ inventory, selectedBlock, onSelectBlock }: HotbarProps) {
  const isTouch = useIsTouchDevice();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10">
      <div className={`bg-stone-900/95 border-2 border-stone-700 rounded-lg shadow-2xl ${
        isTouch ? 'px-2 py-1.5' : 'px-4 py-3'
      }`}>
        <div className="flex items-center gap-2 md:gap-4">
          <div className={`flex items-center gap-1 md:gap-2 text-stone-300 ${isTouch ? 'hidden' : ''}`}>
            <Package className={`${isTouch ? 'w-3 h-3' : 'w-4 h-4'} text-amber-400`} />
            <span className={`${isTouch ? 'text-xs' : 'text-sm'} font-semibold`}>Hotbar:</span>
          </div>
          
          <div className={`flex ${isTouch ? 'gap-1.5' : 'gap-3'}`}>
            {/* Dirt slot */}
            <button
              onClick={() => onSelectBlock('dirt')}
              className={`flex items-center gap-1 md:gap-2 border rounded transition-all ${
                isTouch ? 'px-2 py-1 min-w-[60px]' : 'px-3 py-2 min-w-[80px]'
              } ${
                selectedBlock === 'dirt'
                  ? 'bg-amber-900/70 border-amber-500 ring-2 ring-amber-400 shadow-lg'
                  : 'bg-amber-900/40 border-amber-700/50 hover:bg-amber-900/60'
              }`}
            >
              <div className={`${isTouch ? 'w-3 h-3' : 'w-4 h-4'} bg-amber-800 border border-amber-700 rounded-sm`} />
              <div className="flex flex-col">
                <span className={`${isTouch ? 'text-[10px]' : 'text-xs'} text-amber-300 font-medium`}>Dirt</span>
                <span className={`${isTouch ? 'text-xs' : 'text-sm'} text-amber-100 font-bold`}>{inventory.dirt}</span>
              </div>
            </button>
            
            {/* Stone slot */}
            <button
              onClick={() => onSelectBlock('stone')}
              className={`flex items-center gap-1 md:gap-2 border rounded transition-all ${
                isTouch ? 'px-2 py-1 min-w-[60px]' : 'px-3 py-2 min-w-[80px]'
              } ${
                selectedBlock === 'stone'
                  ? 'bg-slate-700/70 border-slate-400 ring-2 ring-slate-300 shadow-lg'
                  : 'bg-slate-700/40 border-slate-600/50 hover:bg-slate-700/60'
              }`}
            >
              <div className={`${isTouch ? 'w-3 h-3' : 'w-4 h-4'} bg-slate-600 border border-slate-500 rounded-sm`} />
              <div className="flex flex-col">
                <span className={`${isTouch ? 'text-[10px]' : 'text-xs'} text-slate-300 font-medium`}>Stone</span>
                <span className={`${isTouch ? 'text-xs' : 'text-sm'} text-slate-100 font-bold`}>{inventory.stone}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
