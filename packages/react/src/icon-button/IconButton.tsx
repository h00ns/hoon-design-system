import * as React from 'react';
import { Button } from '../button/Button';
import type { ButtonProps } from '../button/Button';
import { cx } from '../utils/cx';

export interface IconButtonProps extends Omit<ButtonProps, 'asChild' | 'children'> {
  /**
   * 버튼의 접근 가능한 이름. 아이콘만으로는 의미가 전달되지 않으므로 필수다.
   * 시각 사용자를 위해 Tooltip 으로 같은 문구를 보여주는 것을 권장한다.
   */
  'aria-label': string;
  /** 장식용 아이콘 하나. 보조기기에서는 자동으로 숨겨진다. */
  children: React.ReactNode;
}

/** 아이콘만 있는 정사각형 버튼. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, children, variant = 'ghost', ...rest },
  ref,
) {
  return (
    <Button {...rest} ref={ref} variant={variant} className={cx('hds-icon-button', className)}>
      <span className="hds-icon-button__icon" aria-hidden="true">
        {children}
      </span>
    </Button>
  );
});
