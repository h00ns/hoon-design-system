import * as React from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

export type OverflowAxis = 'vertical' | 'horizontal' | 'both';

/**
 * 요소의 내용이 넘치는지 추적한다. 넘치는 스크롤 영역은 키보드로도 스크롤할 수 있도록
 * 포커스 가능해야 한다 (WCAG 2.1.1). 영역 크기 변화와 내용 변화(비동기 로딩 등) 모두에 반응한다.
 *
 * @returns [요소에 연결할 콜백 ref, 넘침 여부]
 */
export function useScrollOverflow<T extends HTMLElement>(
  axis: OverflowAxis = 'vertical',
): [(node: T | null) => void, boolean] {
  const [node, setNode] = React.useState<T | null>(null);
  const [overflowing, setOverflowing] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!node) return;
    const update = () => {
      const vertical = node.scrollHeight > node.clientHeight + 1;
      const horizontal = node.scrollWidth > node.clientWidth + 1;
      setOverflowing(
        axis === 'vertical'
          ? vertical
          : axis === 'horizontal'
            ? horizontal
            : vertical || horizontal,
      );
    };
    update();
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    resizeObserver?.observe(node);
    const mutationObserver =
      typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(update);
    mutationObserver?.observe(node, { childList: true, subtree: true, characterData: true });
    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [node, axis]);

  return [setNode, overflowing];
}

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
}

/** 두 ref(콜백·객체)를 하나의 콜백 ref 로 합친다. */
export function useMergedRef<T>(
  a: React.Ref<T> | undefined,
  b: React.Ref<T> | undefined,
): React.RefCallback<T> {
  return React.useCallback(
    (node: T | null) => {
      assignRef(a, node);
      assignRef(b, node);
    },
    [a, b],
  );
}
