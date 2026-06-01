'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Moves focus to #main-content on client-side route changes so screen
 * readers announce the new page rather than staying on the nav link.
 * Skips the initial mount to avoid stealing focus on first load.
 */
export function RouteFocus() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const main = document.getElementById('main-content');
    if (!main) return;
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    main.removeAttribute('tabindex');
  }, [pathname]);

  return null;
}
