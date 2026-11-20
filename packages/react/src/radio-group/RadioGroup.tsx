import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import { useFieldControl } from '../field/field-context';
import { cx } from '../utils/cx';

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export interface RadioGroupRootProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
  'asChild' | 'orientation'
> {
  /**
   * 항목 배치 방향. 키보드는 APG 패턴대로 방향과 관계없이 ←↑ / →↓ 모두 동작한다.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';
  /** 오류 상태. Field 안에서는 `Field.Root invalid` 로 자동 연결된다. */
  invalid?: boolean;
}

const Root = React.forwardRef<HTMLDivElement, RadioGroupRootProps>(function RadioGroupRoot(
  {
    orientation = 'vertical',
    invalid,
    className,
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
  // radiogroup 은 <label for> 로 연결할 수 없으므로 aria-labelledby 로 Field.Label 을 연결한다
  const control = useFieldControl(
    {
      id,
      disabled,
      required,
      'aria-invalid': ariaInvalid ?? (invalid ? true : undefined),
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
    },
    { labelledBy: true },
  );

  return (
    <RadioGroupPrimitive.Root
      {...rest}
      {...control}
      ref={ref}
      // orientation 을 Radix 에 넘기면 한 방향 화살표만 동작하므로 레이아웃용 data 속성으로만 쓴다
      data-orientation={orientation}
      className={cx('hds-radio-group', className)}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

export interface RadioGroupItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
  'asChild'
> {
  /** 항목 레이블. `<label>` 로 렌더링되어 클릭하면 선택된다. */
  children?: React.ReactNode;
  /** 항목 아래 보조 설명. 라디오에 `aria-describedby` 로 연결된다. */
  description?: React.ReactNode;
}

const Item = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(function RadioGroupItem(
  { children, description, className, style, id, 'aria-describedby': ariaDescribedBy, ...rest },
  ref,
) {
  const baseId = React.useId();
  const itemId = id ?? `${baseId}-radio`;
  const descriptionId = description != null ? `${baseId}-description` : undefined;

  return (
    <span
      className={cx('hds-radio', className)}
      style={style}
      data-disabled={rest.disabled ? '' : undefined}
    >
      <RadioGroupPrimitive.Item
        {...rest}
        ref={ref}
        id={itemId}
        aria-describedby={[ariaDescribedBy, descriptionId].filter(Boolean).join(' ') || undefined}
        className="hds-radio__control"
      >
        <RadioGroupPrimitive.Indicator className="hds-radio__indicator" />
      </RadioGroupPrimitive.Item>
      {(children != null || description != null) && (
        <span className="hds-radio__text">
          {children != null && (
            <label className="hds-radio__label" htmlFor={itemId}>
              {children}
            </label>
          )}
          {description != null && (
            <span className="hds-radio__description" id={descriptionId}>
              {description}
            </span>
          )}
        </span>
      )}
    </span>
  );
});

export { Root, Item };
