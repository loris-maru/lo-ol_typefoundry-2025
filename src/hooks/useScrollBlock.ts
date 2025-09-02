import { useEffect } from 'react';

export function useScrollBlock(shouldBlock: boolean) {
  useEffect(() => {
    if (shouldBlock) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Block scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scrolling
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [shouldBlock]);
}
