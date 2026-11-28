import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';
import { useMergedRef } from '../utils/use-scroll-overflow';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';

export type TabsVariant = 'line' | 'segmented';

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export interface TabsRootProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  /** `line`: 밑줄 표시 · `segmented`: 배경이 있는 칩. @default 'line' */
  variant?: TabsVariant;
}

/**
 * 탭 상태를 관리한다.
 * - `activationMode="automatic"`(기본): 화살표로 포커스를 옮기면 바로 패널이 바뀐다.
 * - `activationMode="manual"`: 화살표로 이동만 하고 Enter/Space 로 선택한다.
 *   패널을 그리는 비용이 크거나(데이터 요청 등) 전환이 무거울 때 쓴다.
 */
/** 목록이 Root 의 직계 자식이 아니어도(예: 헤더 안) variant 스타일을 받도록 전달한다 */
const TabsVariantContext = React.createContext<TabsVariant>('line');

const Root = React.forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  { variant = 'line', className, ...rest },
  ref,
) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root
        {...rest}
        ref={ref}
        className={cx('hds-tabs', className)}
        data-variant={variant}
      />
    </TabsVariantContext.Provider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * List
 * -----------------------------------------------------------------------------------------------*/

export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

/**
 * 탭 버튼 목록 (`role="tablist"`). 화면에 제목이 없다면 `aria-label` 로 목록의 이름을 준다.
 * 탭이 많아 넘치면 가로 스크롤되며, 포커스된 탭은 자동으로 보이는 영역으로 스크롤된다.
 */
const List = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, ...rest },
  forwardedRef,
) {
  const variant = React.useContext(TabsVariantContext);
  const localRef = React.useRef<HTMLDivElement>(null);
  const ref = useMergedRef(forwardedRef, localRef);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);

  // 선택된 탭의 위치·크기를 재서 표시(밑줄/칩)를 그 자리로 옮긴다.
  // 첫 측정은 애니메이션 없이 놓고(data-indicator), 그 다음 프레임부터 전환을 켠다(data-indicator-ready).
  useIsomorphicLayoutEffect(() => {
    const list = localRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    let frame = 0;

    const measure = () => {
      const active = list.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
      if (!active) {
        list.removeAttribute('data-indicator');
        return;
      }
      indicator.style.setProperty('--_ind-x', `${active.offsetLeft}px`);
      indicator.style.setProperty('--_ind-y', `${active.offsetTop}px`);
      indicator.style.setProperty('--_ind-w', `${active.offsetWidth}px`);
      indicator.style.setProperty('--_ind-h', `${active.offsetHeight}px`);
      if (!list.hasAttribute('data-indicator')) {
        list.setAttribute('data-indicator', '');
        frame = requestAnimationFrame(() => list.setAttribute('data-indicator-ready', ''));
      }
    };

    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(list);
    list.querySelectorAll('[role="tab"]').forEach((tab) => resize.observe(tab));
    const mutation = new MutationObserver(measure);
    mutation.observe(list, {
      attributes: true,
      attributeFilter: ['data-state'],
      subtree: true,
      childList: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);

  return (
    <TabsPrimitive.List
      {...rest}
      ref={ref}
      className={cx('hds-tabs__list', className)}
      data-variant={variant}
    >
      {children}
      <span ref={indicatorRef} className="hds-tabs__indicator" aria-hidden="true" />
    </TabsPrimitive.List>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

const Trigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { className, onMouseDown, ...rest },
  ref,
) {
  return (
    <TabsPrimitive.Trigger
      {...rest}
      ref={ref}
      className={cx('hds-tabs__trigger', className)}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        // Radix 는 마우스를 누르면 focus() 를 직접 부른다. Chrome 은 코드로 옮긴 포커스를
        // 키보드 포커스로 보고 포커스 링을 그리므로, 먼저 focusVisible: false 로 포커스를 준다.
        // (이미 포커스된 요소에 대한 Radix 의 focus() 는 아무 일도 하지 않는다)
        if (!event.defaultPrevented && event.button === 0 && !event.ctrlKey && !rest.disabled) {
          event.currentTarget.focus({ focusVisible: false } as FocusOptions);
        }
      }}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

/**
 * 탭 패널 (`role="tabpanel"`). 패널 안에 포커스 가능한 요소가 없어도 Tab 으로 패널에
 * 도달할 수 있도록 `tabIndex=0` 을 가진다.
 */
const Content = React.forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, ...rest },
  ref,
) {
  return (
    <TabsPrimitive.Content {...rest} ref={ref} className={cx('hds-tabs__content', className)} />
  );
});

export { Root, List, Trigger, Content };
