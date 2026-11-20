import * as React from 'react';
import { cx } from '../utils/cx';

export type SkeletonShape = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'rect' */
  shape?: SkeletonShape;
  /** 너비. 숫자는 px. text 기본 100%, circle 은 height 와 같다. */
  width?: number | string;
  /** 높이. 숫자는 px. text 는 글자 크기를 따른다. */
  height?: number | string;
  /** shape="text" 일 때 줄 수. 마지막 줄은 짧게 그린다. @default 1 */
  lines?: number;
}

const toSize = (value: number | string | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

/**
 * 콘텐츠가 로드되기 전 자리를 잡아두는 플레이스홀더.
 * 장식이므로 항상 보조기기에서 숨긴다(`aria-hidden`). 로딩 상태 자체는
 * 감싸는 영역의 `aria-busy` 와 상태 메시지로 알린다.
 */
export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = 'rect', width, height, lines = 1, className, style, ...rest },
  ref,
) {
  const size = {
    width: toSize(width ?? (shape === 'circle' ? height : undefined)),
    height: toSize(height ?? (shape === 'circle' ? width : undefined)),
  };

  if (shape === 'text' && lines > 1) {
    return (
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        className={cx('hds-skeleton-group', className)}
        style={{ width: size.width, ...style }}
      >
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className="hds-skeleton"
            data-shape="text"
            data-last={index === lines - 1 ? '' : undefined}
            style={{ height: size.height }}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      {...rest}
      ref={ref}
      aria-hidden="true"
      className={cx('hds-skeleton', className)}
      data-shape={shape}
      style={{ ...size, ...style }}
    />
  );
});
