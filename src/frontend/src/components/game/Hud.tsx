import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pickaxe, Eye, Move, Package } from 'lucide-react';

export function Hud() {
  return (
    <Card className="w-full max-w-2xl bg-stone-900/90 border-stone-700 text-stone-100">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-400">
          <Pickaxe className="w-5 h-5" />
          Shadow Mine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-stone-300 flex items-center gap-2">
            <Move className="w-4 h-4 text-amber-400" />
            <strong>Movement:</strong> Use Arrow Keys or WASD to move. Left/Right/Down move through air tiles. Up is Jump (you cannot fly). On touch devices, on-screen controls appear.
          </p>
          <p className="text-sm text-stone-300 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <strong>Mining:</strong> You can only mine blocks that are touching air on at least one side (up, down, left, or right). Click on exposed blocks to mine them.
          </p>
          <p className="text-sm text-stone-300 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <strong>Collection:</strong> Mined blocks are automatically collected into your hotbar at the bottom of the screen.
          </p>
          <p className="text-sm text-stone-300">
            Mining a block reveals adjacent blocks, expanding your view into the darkness.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-amber-800/50 border-amber-700 text-amber-200">
            Dirt: 2 clicks
          </Badge>
          <Badge variant="outline" className="bg-slate-600/50 border-slate-500 text-slate-200">
            Stone: 5 clicks
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
