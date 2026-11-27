import * as React from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';

/** 기본 표시 지연(ms). 커서가 스쳐 지나갈 때 깜빡이지 않을 만큼, 기다림이 느껴지지 않을 만큼. */
const DEFAULT_DELAY = 300;
/** 툴팁 사이를 옮겨갈 때 지연 없이 바로 보여주는 유예 시간(ms). */
const DEFAULT_SKIP_DELAY = 300;

/** 이 디자인 시스템의 Provider 안에 있는지 표시한다 (없으면 Root 가 스스로 Provider 를 만든다). */
const ProviderPresenceContext = React.createContext(false);

/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/

export type TooltipProviderProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>;

/**
 * 여러 툴팁의 지연 시간을 공유한다. 앱 최상단에 한 번 두면 툴팁 사이를 옮겨 다닐 때 바로 열린다.
 * 없어도 툴팁은 동작한다.
 */
function Provider({
  delayDuration = DEFAULT_DELAY,
  skipDelayDuration = DEFAULT_SKIP_DELAY,
  ...rest
}: TooltipProviderProps) {
  return (
    <ProviderPresenceContext.Provider value={true}>
      <TooltipPrimitive.Provider
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        {...rest}
      />
    </ProviderPresenceContext.Provider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Root · Trigger
 * -----------------------------------------------------------------------------------------------*/

export type TooltipRootProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>;

/** 열린 직후 이 시간 안에 스크롤 때문에 닫히는 것은 무시한다 (ms) */
const SCROLL_CLOSE_GRACE = 600;

/**
 * 툴팁 하나의 열림 상태를 관리한다. Provider 밖에서도 쓸 수 있다.
 *
 * Radix 는 스크롤이 일어나면 툴팁을 닫는다. 그런데 Tab 으로 화면 밖 버튼에 포커스하면
 * 브라우저가 그 버튼을 보이게 스크롤하므로, 키보드 사용자에게는 툴팁이 열리자마자 닫혀 버린다.
 * 열린 직후의 "스크롤로 인한 닫힘"만 무시해 이 문제를 막는다.
 */
function Root({ open: openProp, defaultOpen = false, onOpenChange, ...props }: TooltipRootProps) {
  const hasProvider = React.useContext(ProviderPresenceContext);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolledOpen;
  const openedAt = React.useRef(0);
  const lastScrollAt = React.useRef(0);

  React.useEffect(() => {
    if (!open) return;
    const onScroll = () => {
      lastScrollAt.current = performance.now();
    };
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true });
  }, [open]);

  const handleOpenChange = (next: boolean) => {
    const now = performance.now();
    if (next) {
      openedAt.current = now;
    } else if (now - openedAt.current < SCROLL_CLOSE_GRACE && now - lastScrollAt.current < 100) {
      return;
    }
    if (openProp === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const root = <TooltipPrimitive.Root {...props} open={open} onOpenChange={handleOpenChange} />;
  return hasProvider ? root : <Provider>{root}</Provider>;
}

export type TooltipTriggerProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>;

/**
 * 툴팁을 띄우는 요소. 반드시 포커스 가능한 요소여야 한다 (보통 `asChild` 로 Button/IconButton 을 감싼다).
 * 네이티브 `disabled` 버튼은 이벤트를 받지 못하므로 `focusableWhenDisabled` 를 쓴다.
 */
const Trigger = TooltipPrimitive.Trigger;

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
> {
  /** 트리거를 가리키는 화살표를 그린다. @default true */
  arrow?: boolean;
  /** 포털을 렌더링할 컨테이너. @default document.body */
  container?: HTMLElement | null;
}

/**
 * 툴팁 내용. 트리거의 `aria-describedby` 로 연결되어 스크린리더가 설명으로 읽는다.
 * 짧은 텍스트만 넣는다 — 링크·버튼 같은 인터랙티브 요소는 넣지 않는다 (Popover 를 쓴다).
 */
const Content = React.forwardRef<HTMLDivElement, TooltipContentProps>(function TooltipContent(
  { arrow = true, container, className, children, sideOffset = 6, collisionPadding = 8, ...rest },
  ref,
) {
  return (
    <TooltipPrimitive.Portal container={container}>
      <TooltipPrimitive.Content
        {...rest}
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cx('hds-tooltip', className)}
      >
        {children}
        {arrow && <TooltipPrimitive.Arrow className="hds-tooltip__arrow" width={10} height={5} />}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
});

export { Provider, Root, Trigger, Content };

/* -------------------------------------------------------------------------------------------------
 * SimpleTooltip
 * -----------------------------------------------------------------------------------------------*/

export interface SimpleTooltipProps
  extends
    Pick<
      TooltipRootProps,
      'open' | 'defaultOpen' | 'onOpenChange' | 'delayDuration' | 'disableHoverableContent'
    >,
    Pick<TooltipContentProps, 'side' | 'align' | 'sideOffset' | 'arrow'> {
  /** 툴팁에 보일 짧은 텍스트. */
  content: React.ReactNode;
  /** 트리거가 될 포커스 가능한 요소 하나 (Button, IconButton, 링크 …). */
  children: React.ReactElement;
  /** Content 에 넘길 추가 props. */
  contentProps?: Omit<TooltipContentProps, 'children'>;
}

/**
 * 가장 흔한 형태를 한 줄로 쓰기 위한 축약형.
 *
 * ```tsx
 * <SimpleTooltip content="설정">
 *   <IconButton aria-label="설정"><GearIcon /></IconButton>
 * </SimpleTooltip>
 * ```
 */
export function SimpleTooltip({
  content,
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  disableHoverableContent,
  side,
  align,
  sideOffset,
  arrow,
  contentProps,
}: SimpleTooltipProps) {
  return (
    <Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <Trigger asChild>{children}</Trigger>
      <Content
        {...contentProps}
        side={side ?? contentProps?.side}
        align={align ?? contentProps?.align}
        sideOffset={sideOffset ?? contentProps?.sideOffset}
        arrow={arrow ?? contentProps?.arrow}
      >
        {content}
      </Content>
    </Root>
  );
}
