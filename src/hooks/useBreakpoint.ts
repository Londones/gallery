
import { useState, useEffect } from 'react';

const breakpoints = {
  sm: 640,
  lg: 1024,
  xl: 1280,
};

export function useBreakpoint() {
  const [numColumns, setNumColumns] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= breakpoints.xl) {
        setNumColumns(4);
      } else if (width >= breakpoints.lg) {
        setNumColumns(3);
      } else if (width >= breakpoints.sm) {
        setNumColumns(2);
      } else {
        setNumColumns(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return numColumns;
}
