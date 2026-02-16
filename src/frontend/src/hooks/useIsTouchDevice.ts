import { useState, useEffect } from 'react';

/**
 * Hook to detect if the device has touch capabilities.
 * Uses maxTouchPoints and pointer media query to determine touch support.
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device has touch points
    const hasTouchPoints = navigator.maxTouchPoints > 0;
    
    // Check for coarse pointer (typically touch devices)
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    
    setIsTouch(hasTouchPoints || hasCoarsePointer);
  }, []);

  return isTouch;
}
