import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

/* -------------------------------------------------------------------------------------------------
 * Root · Trigger · Anchor · Close
 * -----------------------------------------------------------------------------------------------*/

export type PopoverRootProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>;
export type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;
export type PopoverAnchorProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>;
export type PopoverCloseProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>;

/** 팝오버의 열림 상태를 관리한다. 기본은 비모달(`modal={false}`)이라 바깥과 계속 상호작용할 수 있다. */
const Root = PopoverPrimitive.Root;
/** 팝오버를 여는 요소. 보통 `asChild` 로 Button 을 감싼다. */
const Trigger = PopoverPrimitive.Trigger;
/** 트리거가 아닌 다른 요소를 기준으로 위치시키고 싶을 때 쓴다. */
const Anchor = PopoverPrimitive.Anchor;
/** 팝오버를 닫는 요소. */
const Close = PopoverPrimitive.Close;

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> {
  /** 트리거를 가리키는 화살표를 그린다. @default false */
  arrow?: boolean;
  /** 포털을 렌더링할 컨테이너. @default document.body */
  container?: HTMLElement | null;
}

/**
 * 트리거 옆에 떠 있는 비모달 패널 (`role="dialog"`).
 * `Popover.Title` 을 넣거나 `aria-label` 로 이름을 준다.
 */
const Content = React.forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    arrow = false,
    container,
    className,
    children,
    sideOffset = 8,
    collisionPadding = 8,
    align = 'center',
    ...rest
  },
  ref,
) {
  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        {...rest}
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        align={align}
        className={cx('hds-popover', className)}
      >
        {children}
        {arrow && <PopoverPrimitive.Arrow className="hds-popover__arrow" width={14} height={7} />}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Title · Description
 * -----------------------------------------------------------------------------------------------*/

export type PopoverTitleProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Title>;

/** 팝오버의 접근 가능한 이름 (`aria-labelledby` 로 자동 연결). */
const Title = React.forwardRef<HTMLHeadingElement, PopoverTitleProps>(function PopoverTitle(
  { className, ...rest },
  ref,
) {
  return (
    <PopoverPrimitive.Title {...rest} ref={ref} className={cx('hds-popover__title', className)} />
  );
});

export type PopoverDescriptionProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Description
>;

/** 팝오버의 접근 가능한 설명 (`aria-describedby` 로 자동 연결). */
const Description = React.forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  function PopoverDescription({ className, ...rest }, ref) {
    return (
      <PopoverPrimitive.Description
        {...rest}
        ref={ref}
        className={cx('hds-popover__description', className)}
      />
    );
  },
);

export { Root, Trigger, Anchor, Close, Content, Title, Description };
