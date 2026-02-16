import { Package } from 'lucide-react';
import type { InventoryCounts } from '../../game/inventory';

interface HotbarProps {
  inventory: InventoryCounts;
}

export function Hotbar({ inventory }: HotbarProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-stone-900/95 border-2 border-stone-700 rounded-lg shadow-2xl px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-stone-300">
            <Package className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold">Hotbar:</span>
          </div>
          
          <div className="flex gap-3">
            {/* Dirt slot */}
            <div className="flex items-center gap-2 bg-amber-900/40 border border-amber-700/50 rounded px-3 py-2 min-w-[80px]">
              <div className="w-4 h-4 bg-amber-800 border border-amber-700 rounded-sm" />
              <div className="flex flex-col">
                <span className="text-xs text-amber-300 font-medium">Dirt</span>
                <span className="text-sm text-amber-100 font-bold">{inventory.dirt}</span>
              </div>
            </div>
            
            {/* Stone slot */}
            <div className="flex items-center gap-2 bg-slate-700/40 border border-slate-600/50 rounded px-3 py-2 min-w-[80px]">
              <div className="w-4 h-4 bg-slate-600 border border-slate-500 rounded-sm" />
              <div className="flex flex-col">
                <span className="text-xs text-slate-300 font-medium">Stone</span>
                <span className="text-sm text-slate-100 font-bold">{inventory.stone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
