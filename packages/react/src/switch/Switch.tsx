import * as React from 'react';
import { Switch as SwitchPrimitive } from 'radix-ui';
import { useFieldControl } from '../field/field-context';
import { cx } from '../utils/cx';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps extends Omit<
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  'asChild'
> {
  /** @default 'md' */
  size?: SwitchSize;
  /** 오류 상태. Field 안에서는 `Field.Root invalid` 로 자동 연결된다. */
  invalid?: boolean;
  /** 스위치 레이블. `<label>` 로 렌더링되어 클릭하면 토글된다. */
  children?: React.ReactNode;
  /** 레이블을 스위치 앞(왼쪽)에 둔다. 설정 목록처럼 오른쪽 정렬할 때 쓴다. @default 'end' */
  labelPosition?: 'start' | 'end';
}

/**
 * 켜고 끄는 즉시 반영되는 설정 (예: 알림 받기). 제출 버튼을 눌러야 반영되면 Checkbox 를 쓴다.
 * `className` 은 바깥 래퍼에, 나머지 props 와 `ref` 는 `button[role=switch]` 에 전달된다.
 */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    size = 'md',
    invalid,
    children,
    labelPosition = 'end',
    className,
    style,
    id,
    disabled,
    required,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const control = useFieldControl({
    id,
    disabled,
    required,
    'aria-invalid': ariaInvalid ?? (invalid ? true : undefined),
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
  });

  return (
    <span
      className={cx('hds-switch', className)}
      style={style}
      data-size={size}
      data-label-position={labelPosition}
      data-disabled={control.disabled ? '' : undefined}
    >
      <SwitchPrimitive.Root {...rest} {...control} ref={ref} className="hds-switch__control">
        <SwitchPrimitive.Thumb className="hds-switch__thumb" />
      </SwitchPrimitive.Root>
      {children != null && (
        <label className="hds-switch__label" htmlFor={control.id}>
          {children}
        </label>
      )}
    </span>
  );
});
