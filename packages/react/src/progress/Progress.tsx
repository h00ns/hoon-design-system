import * as React from 'react';
import { Progress as ProgressPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressTone = 'accent' | 'success' | 'critical';

export interface ProgressProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  'children'
> {
  /** 현재 값. `null` 이면 진행률을 알 수 없는 상태(indeterminate)로 그린다. @default null */
  value?: number | null;
  /** 최댓값. @default 100 */
  max?: number;
  /**
   * 스크린리더가 읽을 값 문구(`aria-valuetext`)를 만든다. 화면에 보이는 값에도 같은 문구를 쓴다.
   * @default (value, max) => `${Math.round((value / max) * 100)}%`
   */
  getValueLabel?: (value: number, max: number) => string;
  /** 막대 위에 보이는 레이블. 주면 진행 막대의 접근 가능한 이름으로 연결된다. */
  label?: React.ReactNode;
  /** 레이블 옆에 현재 값을 보여준다 (indeterminate 이면 숨김). @default false */
  showValue?: boolean;
  /** 막대 두께. @default 'md' */
  size?: ProgressSize;
  /** 색. 완료·실패 같은 상태를 색만으로 전하지 말고 레이블에도 적는다. @default 'accent' */
  tone?: ProgressTone;
}

const defaultValueLabel = (value: number, max: number) => `${Math.round((value / max) * 100)}%`;

/**
 * 작업의 진행 정도를 보여주는 막대 (`role="progressbar"`).
 * 레이블이 없다면 `aria-label` 로 무엇의 진행률인지 알려야 한다.
 * `className`·`style` 은 바깥 래퍼에, `ref` 와 나머지 props 는 progressbar 요소에 붙는다.
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = null,
    max = 100,
    getValueLabel = defaultValueLabel,
    label,
    showValue = false,
    size = 'md',
    tone = 'accent',
    className,
    style,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const labelId = React.useId();
  const clamped = value === null ? null : Math.min(Math.max(value, 0), max);
  const percent = clamped === null ? 0 : (clamped / max) * 100;
  const hasHeader = label != null || (showValue && clamped !== null);

  return (
    <div
      className={cx('hds-progress', className)}
      style={style}
      data-size={size}
      data-tone={tone}
      data-indeterminate={clamped === null ? '' : undefined}
    >
      {hasHeader && (
        <div className="hds-progress__header">
          {label != null && (
            <span id={labelId} className="hds-progress__label">
              {label}
            </span>
          )}
          {showValue && clamped !== null && (
            // 같은 값을 aria-valuetext 로도 전하므로 중복 낭독을 막는다
            <span className="hds-progress__value" aria-hidden="true">
              {getValueLabel(clamped, max)}
            </span>
          )}
        </div>
      )}
      <ProgressPrimitive.Root
        {...rest}
        ref={ref}
        value={clamped}
        max={max}
        getValueLabel={getValueLabel}
        aria-labelledby={ariaLabelledBy ?? (label != null ? labelId : undefined)}
        className="hds-progress__track"
      >
        <ProgressPrimitive.Indicator
          className="hds-progress__indicator"
          style={clamped === null ? undefined : { transform: `translateX(-${100 - percent}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
