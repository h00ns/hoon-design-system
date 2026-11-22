import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

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
  { className, ...rest },
  ref,
) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.List
      {...rest}
      ref={ref}
      className={cx('hds-tabs__list', className)}
      data-variant={variant}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

const Trigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { className, ...rest },
  ref,
) {
  return (
    <TabsPrimitive.Trigger {...rest} ref={ref} className={cx('hds-tabs__trigger', className)} />
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
