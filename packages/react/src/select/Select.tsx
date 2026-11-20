import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';
import { useFieldContext, useFieldControl } from '../field/field-context';

export type SelectSize = 'sm' | 'md' | 'lg';

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    {...props}
  >
    <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    {...props}
  >
    <path d="m4 10 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    {...props}
  >
    <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export type SelectRootProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

/**
 * 선택 상태를 관리한다. `name` 을 주면 네이티브 폼 제출에 값이 포함된다.
 * Field 안에 있으면 Field 의 `disabled`·`required` 를 이어받는다.
 */
function Root({ disabled, required, ...rest }: SelectRootProps) {
  const field = useFieldContext();
  return (
    <SelectPrimitive.Root
      {...rest}
      disabled={disabled ?? (field?.disabled || undefined)}
      required={required ?? (field?.required || undefined)}
    />
  );
}

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
> {
  /** 크기. Input 과 같은 높이를 쓴다. @default 'md' */
  size?: SelectSize;
}

const Trigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
  { size = 'md', className, children, ...rest },
  ref,
) {
  // Field 의 레이블·설명·오류를 트리거(combobox)에 연결한다.
  // required 는 Root 가 aria-required 로 처리하므로 버튼에는 넘기지 않는다.
  const control = useFieldControl({
    id: rest.id,
    disabled: rest.disabled,
    'aria-describedby': rest['aria-describedby'],
    'aria-labelledby': rest['aria-labelledby'],
    'aria-invalid': rest['aria-invalid'],
  });
  return (
    <SelectPrimitive.Trigger
      {...rest}
      id={control.id}
      disabled={control.disabled}
      aria-describedby={control['aria-describedby']}
      aria-labelledby={control['aria-labelledby']}
      aria-invalid={control['aria-invalid']}
      ref={ref}
      className={cx('hds-select__trigger', className)}
      data-size={size}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="hds-select__icon" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Value
 * -----------------------------------------------------------------------------------------------*/

export type SelectValueProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>;

/** 선택된 항목의 텍스트를 보여준다. 값이 없으면 `placeholder` 를 보여준다. */
const Value = React.forwardRef<HTMLSpanElement, SelectValueProps>(function SelectValue(
  { className, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Value {...rest} ref={ref} className={cx('hds-select__value', className)} />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export interface SelectContentProps extends React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
> {
  /** 포털 대상. 기본은 document.body */
  container?: HTMLElement | null;
}

const Content = React.forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(
  {
    className,
    children,
    position = 'popper',
    sideOffset = 4,
    collisionPadding = 8,
    container,
    ...rest
  },
  ref,
) {
  return (
    <SelectPrimitive.Portal container={container}>
      <SelectPrimitive.Content
        {...rest}
        ref={ref}
        position={position}
        // item-aligned 모드는 sideOffset 등을 받지 않는다
        {...(position === 'popper' ? { sideOffset, collisionPadding } : {})}
        className={cx('hds-select__content', className)}
        data-position={position}
      >
        <SelectPrimitive.ScrollUpButton className="hds-select__scroll-button">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="hds-select__viewport">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="hds-select__scroll-button">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

export type SelectItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;

const Item = React.forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Item {...rest} ref={ref} className={cx('hds-select__item', className)}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="hds-select__item-indicator">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Group / Label / Separator
 * -----------------------------------------------------------------------------------------------*/

export type SelectGroupProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Group>;

const Group = React.forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { className, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Group {...rest} ref={ref} className={cx('hds-select__group', className)} />
  );
});

export type SelectLabelProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

/** 그룹 제목. 선택할 수 없고, 그룹의 접근 가능한 이름이 된다. */
const Label = React.forwardRef<HTMLDivElement, SelectLabelProps>(function SelectLabel(
  { className, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Label {...rest} ref={ref} className={cx('hds-select__label', className)} />
  );
});

export type SelectSeparatorProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

const Separator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(function SelectSeparator(
  { className, ...rest },
  ref,
) {
  return (
    <SelectPrimitive.Separator
      {...rest}
      ref={ref}
      className={cx('hds-select__separator', className)}
    />
  );
});

export { Root, Trigger, Value, Content, Item, Group, Label, Separator };
