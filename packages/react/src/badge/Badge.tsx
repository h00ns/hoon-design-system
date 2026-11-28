import * as React from 'react';
import { cx } from '../utils/cx';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'critical';
export type BadgeVariant = 'subtle' | 'solid';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 의미 색. 색만으로 의미를 전달하지 말고 텍스트에도 담는다. @default 'neutral' */
  tone?: BadgeTone;
  /** 강조 정도. @default 'subtle' */
  variant?: BadgeVariant;
  /** @default 'md' */
  size?: BadgeSize;
}

/**
 * 상태·분류·개수를 짧게 표시하는 비인터랙티브 레이블.
 * 클릭이 필요하면 Button 을 쓴다.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'subtle', size = 'md', className, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      className={cx('hds-badge', className)}
      data-tone={tone}
      data-variant={variant}
      data-size={size}
    />
  );
});
