import * as React from 'react';
import { Slot } from 'radix-ui';
import { cx } from '../utils/cx';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 자식 요소를 루트로 렌더링한다. */
  asChild?: boolean;
  /** 포커스를 받으면 화면에 드러낸다 (예: "본문 바로가기" 링크). @default false */
  focusable?: boolean;
}

/** 화면에는 보이지 않지만 스크린리더는 읽는 콘텐츠. */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ asChild = false, focusable = false, className, ...rest }, ref) {
    const Comp = asChild ? Slot.Root : 'span';
    return (
      <Comp
        {...rest}
        ref={ref}
        className={cx('hds-visually-hidden', className)}
        data-focusable={focusable ? '' : undefined}
      />
    );
  },
);
