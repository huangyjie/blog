import { useLayoutEffect } from 'react';
import { globalStyles } from '@/styles/globalStyles';

export function useGlobalStyles() {
  useLayoutEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
} 