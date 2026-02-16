import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onJump: () => void;
}

/**
 * On-screen touch controls for mobile devices.
 * Provides directional buttons for movement and jump.
 */
export function TouchControls({ onMoveLeft, onMoveRight, onMoveDown, onJump }: TouchControlsProps) {
  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center items-end gap-8 px-4 pointer-events-none z-50">
      {/* Left/Right/Down controls */}
      <div className="relative pointer-events-auto">
        <div className="grid grid-cols-3 gap-2">
          <div />
          <Button
            size="lg"
            variant="secondary"
            className="w-16 h-16 bg-stone-800/90 hover:bg-stone-700/90 border-2 border-amber-600/50 active:bg-amber-700/50"
            onTouchStart={(e) => {
              e.preventDefault();
              onMoveDown();
            }}
          >
            <ArrowDown className="w-6 h-6 text-amber-400" />
          </Button>
          <div />
          
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
          <div />
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
