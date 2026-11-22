import * as React from 'react';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

/* -------------------------------------------------------------------------------------------------
 * Root · Trigger
 * -----------------------------------------------------------------------------------------------*/

export interface HoverCardRootProps extends React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Root
> {
  /** 포인터를 올린 뒤 열리기까지의 지연(ms). 지나가다 스친 포인터로 열리지 않게 한다. @default 500 */
  openDelay?: number;
  /** 포인터가 벗어난 뒤 닫히기까지의 지연(ms). 카드로 포인터를 옮길 시간을 준다. @default 300 */
  closeDelay?: number;
}

/**
 * 링크 등에 포인터를 올리거나 키보드로 포커스했을 때 미리보기를 보여준다.
 * 마우스·키보드 전용 보조 정보다. 터치에서는 열리지 않으므로 같은 정보에 다른 경로로도 닿을 수 있어야 한다.
 */
function Root({ openDelay = 500, closeDelay = 300, ...rest }: HoverCardRootProps) {
  return <HoverCardPrimitive.Root {...rest} openDelay={openDelay} closeDelay={closeDelay} />;
}

export type HoverCardTriggerProps = React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Trigger
>;

/**
 * 카드를 여는 요소. 기본은 `<a>` 이며, 실제로 이동하는 링크여야 한다 (`asChild` 로 라우터 Link 를 감싼다).
 * 카드의 내용은 이 링크가 가리키는 페이지에도 반드시 있어야 한다.
 */
const Trigger = HoverCardPrimitive.Trigger;

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export interface HoverCardContentProps extends React.ComponentPropsWithoutRef<
  typeof HoverCardPrimitive.Content
> {
  /** 트리거를 가리키는 화살표를 그린다. @default false */
  arrow?: boolean;
  /** 포털을 렌더링할 컨테이너. @default document.body */
  container?: HTMLElement | null;
}

/**
 * 떠 있는 미리보기 카드. 안의 링크·버튼은 키보드로 닿을 수 없으므로(Radix 가 탭 순서에서 뺀다)
 * 조작 요소를 넣지 않는다.
 */
const Content = React.forwardRef<HTMLDivElement, HoverCardContentProps>(function HoverCardContent(
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
    <HoverCardPrimitive.Portal container={container}>
      <HoverCardPrimitive.Content
        {...rest}
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        align={align}
        className={cx('hds-hover-card', className)}
      >
        {children}
        {arrow && (
          <HoverCardPrimitive.Arrow className="hds-hover-card__arrow" width={14} height={7} />
        )}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
});

export { Root, Trigger, Content };
