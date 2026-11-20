import * as React from 'react';
import { Separator as SeparatorPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<
  typeof SeparatorPrimitive.Root
> {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /**
   * 시각적 구분만 하는 장식용 선이면 true (보조기기에서 숨김).
   * 콘텐츠 묶음을 의미적으로 나누면 false → `role="separator"`.
   * @default true
   */
  decorative?: boolean;
}

/** 콘텐츠를 시각적·의미적으로 나누는 선. */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = true, className, ...rest },
  ref,
) {
  return (
    <SeparatorPrimitive.Root
      {...rest}
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cx('hds-separator', className)}
    />
  );
});
