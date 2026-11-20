import * as React from 'react';

/** SSR 에서는 useEffect, 브라우저에서는 useLayoutEffect (서버 경고 방지) */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
