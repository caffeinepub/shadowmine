import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
}

/**
 * On-screen touch controls for mobile devices.
 * Provides left/right directional buttons and a jump button.
 */
export function TouchControls({ onMoveLeft, onMoveRight, onJump }: TouchControlsProps) {
  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center items-end gap-8 px-4 pointer-events-none z-50">
      {/* Left/Right controls */}
      <div className="relative pointer-events-auto">
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="secondary"
            className="w-16 h-16 bg-stone-800/90 hover:bg-stone-700/90 border-2 border-amber-600/50 active:bg-amber-700/50"
            onTouchStart={(e) => {
              e.preventDefault();
              onMoveLeft();
            }}
          >
            <ArrowLeft className="w-6 h-6 text-amber-400" />
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-16 h-16 bg-stone-800/90 hover:bg-stone-700/90 border-2 border-amber-600/50 active:bg-amber-700/50"
            onTouchStart={(e) => {
              e.preventDefault();
              onMoveRight();
            }}
          >
            <ArrowRight className="w-6 h-6 text-amber-400" />
          </Button>
        </div>
      </div>

      {/* Jump button */}
      <div className="pointer-events-auto">
        <Button
          size="lg"
          variant="secondary"
          className="w-20 h-20 bg-amber-800/90 hover:bg-amber-700/90 border-2 border-amber-500 active:bg-amber-600/90 rounded-full"
          onTouchStart={(e) => {
            e.preventDefault();
            onJump();
          }}
        >
          <ArrowUp className="w-8 h-8 text-amber-200" />
        </Button>
      </div>
    </div>
  );
}
