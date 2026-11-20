import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

const ChevronDownIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export type AccordionRootProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

/**
 * - `type="single"`: 한 번에 하나만 열린다. `collapsible` 을 주면 열린 항목을 다시 닫을 수 있다.
 * - `type="multiple"`: 여러 항목을 동시에 열 수 있다.
 */
const Root = React.forwardRef<HTMLDivElement, AccordionRootProps>(function AccordionRoot(
  { className, ...rest },
  ref,
) {
  return <AccordionPrimitive.Root {...rest} ref={ref} className={cx('hds-accordion', className)} />;
});

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const Item = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { className, ...rest },
  ref,
) {
  return (
    <AccordionPrimitive.Item {...rest} ref={ref} className={cx('hds-accordion__item', className)} />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

export type AccordionHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> {
  /**
   * 트리거를 감싸는 제목 요소의 레벨. 페이지의 제목 구조에 맞춘다
   * (예: 섹션 제목이 h2 면 아코디언은 h3). @default 3
   */
  headingLevel?: AccordionHeadingLevel;
}

const Trigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ headingLevel = 3, className, children, ...rest }, ref) {
    const Heading = `h${headingLevel}` as const;
    return (
      <AccordionPrimitive.Header asChild>
        <Heading className="hds-accordion__header">
          <AccordionPrimitive.Trigger
            {...rest}
            ref={ref}
            className={cx('hds-accordion__trigger', className)}
          >
            <span className="hds-accordion__title">{children}</span>
            <span className="hds-accordion__icon">
              <ChevronDownIcon />
            </span>
          </AccordionPrimitive.Trigger>
        </Heading>
      </AccordionPrimitive.Header>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>;

/** 높이 애니메이션은 바깥 요소에, 여백은 안쪽 요소에 둔다 (padding 이 있으면 높이 계산이 튄다). */
const Content = React.forwardRef<HTMLDivElement, AccordionContentProps>(function AccordionContent(
  { className, children, ...rest },
  ref,
) {
  return (
    <AccordionPrimitive.Content {...rest} ref={ref} className="hds-accordion__content">
      <div className={cx('hds-accordion__content-inner', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});

export { Root, Item, Trigger, Content };
