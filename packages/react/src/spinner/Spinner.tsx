import * as React from 'react';
import { cx } from '../utils/cx';

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 스크린리더에 전달할 상태 문구. @default '불러오는 중' */
  label?: string;
  /** @default 'md' */
  size?: SpinnerSize;
}

/**
 * 진행 중임을 알리는 표시. `role="status"` 라 스크린리더가 label 을 읽는다.
 * 버튼 안의 로딩은 Button 의 `loading` 을 쓴다.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { label = '불러오는 중', size = 'md', className, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      role="status"
      className={cx('hds-spinner', className)}
      data-size={size}
    >
      <span className="hds-spinner__circle" aria-hidden="true" />
      <span className="hds-visually-hidden">{label}</span>
    </span>
  );
});
