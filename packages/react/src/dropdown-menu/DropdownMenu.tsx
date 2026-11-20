import * as React from 'react';
import { DropdownMenu as MenuPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="m3.5 8.5 3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DotIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <circle cx="8" cy="8" r="3" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="m6 4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -------------------------------------------------------------------------------------------------
 * Root / Trigger / Group / RadioGroup / Sub — 동작만 있고 스타일이 없는 부분은 그대로 노출한다
 * -----------------------------------------------------------------------------------------------*/

export type DropdownMenuRootProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Root>;
export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>;
export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Group>;
export type DropdownMenuRadioGroupProps = React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.RadioGroup
>;
export type DropdownMenuSubProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Sub>;

/** 메뉴 상태를 관리한다. `modal` 기본값 true — 열린 동안 바깥은 보조기기에서 숨겨진다. */
const Root = MenuPrimitive.Root;
/** 메뉴를 여는 버튼. 보통 `asChild` 로 Button·IconButton 을 감싼다. */
const Trigger = MenuPrimitive.Trigger;
const Group = MenuPrimitive.Group;
const RadioGroup = MenuPrimitive.RadioGroup;
const Sub = MenuPrimitive.Sub;

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export interface DropdownMenuContentProps extends React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.Content
> {
  /** 포털 대상. 기본은 document.body */
  container?: HTMLElement | null;
}

const Content = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { className, sideOffset = 4, collisionPadding = 8, align = 'start', container, ...rest },
    ref,
  ) {
    return (
      <MenuPrimitive.Portal container={container}>
        <MenuPrimitive.Content
          {...rest}
          ref={ref}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          align={align}
          className={cx('hds-menu', className)}
        />
      </MenuPrimitive.Portal>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

export type DropdownMenuItemVariant = 'default' | 'danger';

export interface DropdownMenuItemProps extends React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.Item
> {
  /** 되돌릴 수 없는 동작(삭제 등)은 `danger`. @default 'default' */
  variant?: DropdownMenuItemVariant;
  /** 아이콘이 없는 항목을 아이콘 있는 항목과 정렬한다. */
  inset?: boolean;
}

const Item = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(function DropdownMenuItem(
  { className, variant = 'default', inset = false, ...rest },
  ref,
) {
  return (
    <MenuPrimitive.Item
      {...rest}
      ref={ref}
      className={cx('hds-menu__item', className)}
      data-variant={variant}
      data-inset={inset ? '' : undefined}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * CheckboxItem / RadioItem
 * -----------------------------------------------------------------------------------------------*/

export type DropdownMenuCheckboxItemProps = React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.CheckboxItem
>;

const CheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem({ className, children, ...rest }, ref) {
    return (
      <MenuPrimitive.CheckboxItem {...rest} ref={ref} className={cx('hds-menu__item', className)}>
        <span className="hds-menu__indicator">
          <MenuPrimitive.ItemIndicator>
            <CheckIcon />
          </MenuPrimitive.ItemIndicator>
        </span>
        {children}
      </MenuPrimitive.CheckboxItem>
    );
  },
);

export type DropdownMenuRadioItemProps = React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.RadioItem
>;

const RadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem({ className, children, ...rest }, ref) {
    return (
      <MenuPrimitive.RadioItem {...rest} ref={ref} className={cx('hds-menu__item', className)}>
        <span className="hds-menu__indicator">
          <MenuPrimitive.ItemIndicator>
            <DotIcon />
          </MenuPrimitive.ItemIndicator>
        </span>
        {children}
      </MenuPrimitive.RadioItem>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Label / Separator / Shortcut
 * -----------------------------------------------------------------------------------------------*/

export interface DropdownMenuLabelProps extends React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.Label
> {
  inset?: boolean;
}

/** 그룹 제목. 포커스를 받지 않는다. 그룹 이름으로 쓰려면 Group 에 aria-labelledby 로 연결한다. */
const Label = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(function DropdownMenuLabel(
  { className, inset = false, ...rest },
  ref,
) {
  return (
    <MenuPrimitive.Label
      {...rest}
      ref={ref}
      className={cx('hds-menu__label', className)}
      data-inset={inset ? '' : undefined}
    />
  );
});

export type DropdownMenuSeparatorProps = React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.Separator
>;

const Separator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...rest }, ref) {
    return (
      <MenuPrimitive.Separator
        {...rest}
        ref={ref}
        className={cx('hds-menu__separator', className)}
      />
    );
  },
);

export type DropdownMenuShortcutProps = React.HTMLAttributes<HTMLSpanElement>;

/**
 * 단축키 표시. 시각적 힌트일 뿐이라 보조기기에서는 숨긴다 —
 * 단축키를 보조기기에 알리려면 Item 에 `aria-keyshortcuts` 를 준다.
 */
const Shortcut = React.forwardRef<HTMLSpanElement, DropdownMenuShortcutProps>(
  function DropdownMenuShortcut({ className, ...rest }, ref) {
    return (
      <span
        aria-hidden="true"
        {...rest}
        ref={ref}
        className={cx('hds-menu__shortcut', className)}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * SubTrigger / SubContent
 * -----------------------------------------------------------------------------------------------*/

export interface DropdownMenuSubTriggerProps extends React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.SubTrigger
> {
  inset?: boolean;
}

const SubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  function DropdownMenuSubTrigger({ className, children, inset = false, ...rest }, ref) {
    return (
      <MenuPrimitive.SubTrigger
        {...rest}
        ref={ref}
        className={cx('hds-menu__item', 'hds-menu__sub-trigger', className)}
        data-inset={inset ? '' : undefined}
      >
        {children}
        <span className="hds-menu__chevron">
          <ChevronRightIcon />
        </span>
      </MenuPrimitive.SubTrigger>
    );
  },
);

export interface DropdownMenuSubContentProps extends React.ComponentPropsWithoutRef<
  typeof MenuPrimitive.SubContent
> {
  container?: HTMLElement | null;
}

const SubContent = React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  function DropdownMenuSubContent(
    { className, sideOffset = 2, alignOffset = -5, collisionPadding = 8, container, ...rest },
    ref,
  ) {
    return (
      <MenuPrimitive.Portal container={container}>
        <MenuPrimitive.SubContent
          {...rest}
          ref={ref}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={cx('hds-menu', className)}
        />
      </MenuPrimitive.Portal>
    );
  },
);

export {
  Root,
  Trigger,
  Content,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Label,
  Separator,
  Shortcut,
  Group,
  Sub,
  SubTrigger,
  SubContent,
};
