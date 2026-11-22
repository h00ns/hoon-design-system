import * as React from 'react';
import { Collapsible as CollapsiblePrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export type CollapsibleRootProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>;

/** 접고 펼 수 있는 영역 하나. `open`/`onOpenChange`(제어) 또는 `defaultOpen`(비제어). */
const Root = React.forwardRef<HTMLDivElement, CollapsibleRootProps>(function CollapsibleRoot(
  { className, ...rest },
  ref,
) {
  return (
    <CollapsiblePrimitive.Root {...rest} ref={ref} className={cx('hds-collapsible', className)} />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Trigger
>;

/**
 * 영역을 여닫는 버튼 (`aria-expanded`·`aria-controls` 자동).
 * 보통 `asChild` 로 Button 을 감싸고, 그대로 쓰면 텍스트 버튼 모양이 된다.
 */
const Trigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, asChild, ...rest }, ref) {
    return (
      <CollapsiblePrimitive.Trigger
        {...rest}
        asChild={asChild}
        ref={ref}
        className={cx(!asChild && 'hds-collapsible__trigger', className)}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export type CollapsibleContentProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.Content
>;

/**
 * 접히는 내용. 닫히면 DOM 에서 빠지고(`forceMount` 로 유지 가능) 높이 애니메이션은 바깥 요소에, 여백은 안쪽 요소에 둔다.
 */
const Content = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ className, children, ...rest }, ref) {
    return (
      <CollapsiblePrimitive.Content {...rest} ref={ref} className="hds-collapsible__content">
        <div className={cx('hds-collapsible__content-inner', className)}>{children}</div>
      </CollapsiblePrimitive.Content>
    );
  },
);

export { Root, Trigger, Content };
