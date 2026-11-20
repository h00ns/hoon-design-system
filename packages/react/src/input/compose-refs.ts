import type * as React from 'react';

/** 여러 ref(콜백·객체)에 같은 노드를 할당하는 ref 를 만든다. */
export function composeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}
