import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { useFieldControl } from '../field/field-context';
import { cx } from '../utils/cx';

export type CheckedState = CheckboxPrimitive.CheckedState;

export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'asChild'
> {
  /** 오류 상태. Field 안에서는 `Field.Root invalid` 로 자동 연결된다. */
  invalid?: boolean;
  /**
   * 체크박스 옆에 붙는 레이블. `<label>` 로 렌더링되어 클릭하면 체크박스가 토글된다.
   * 생략하면 Field.Label 이나 `aria-label` 로 이름을 줘야 한다.
   */
  children?: React.ReactNode;
}

const CheckIcon = () => (
  <svg
    className="hds-checkbox__icon"
    data-icon="check"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3.5 8.5 6.5 11.5 12.5 4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IndeterminateIcon = () => (
  <svg
    className="hds-checkbox__icon"
    data-icon="indeterminate"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * 체크박스. 선택 결과는 폼 제출 시점에 반영되는 경우에 쓴다 (즉시 반영이면 Switch).
 * `className` 은 바깥 래퍼에, 나머지 props 와 `ref` 는 체크박스(`button[role=checkbox]`)에 전달된다.
 */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    invalid,
    children,
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
      className={cx('hds-checkbox', className)}
      style={style}
      data-disabled={control.disabled ? '' : undefined}
    >
      <CheckboxPrimitive.Root {...rest} {...control} ref={ref} className="hds-checkbox__control">
        <CheckboxPrimitive.Indicator className="hds-checkbox__indicator">
          <CheckIcon />
          <IndeterminateIcon />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {children != null && (
        <label className="hds-checkbox__label" htmlFor={control.id}>
          {children}
        </label>
      )}
    </span>
  );
});
