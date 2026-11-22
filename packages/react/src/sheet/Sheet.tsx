import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import { useMergedRef, useScrollOverflow } from '../utils/use-scroll-overflow';

/* -------------------------------------------------------------------------------------------------
 * Root · Trigger · Close
 * -----------------------------------------------------------------------------------------------*/

const SheetModalContext = React.createContext(true);

export type SheetRootProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
export type SheetTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
export type SheetCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

/**
 * 시트의 열림 상태를 관리한다. `open`/`onOpenChange`(제어) 또는 `defaultOpen`(비제어).
 * `modal={false}` 이면 오버레이·포커스 트랩·스크롤 잠금 없이 페이지와 함께 쓸 수 있다.
 */
function Root({ modal = true, ...rest }: SheetRootProps) {
  return (
    <SheetModalContext.Provider value={modal}>
      <DialogPrimitive.Root {...rest} modal={modal} />
    </SheetModalContext.Provider>
  );
}

/** 시트를 여는 요소. 보통 `asChild` 로 Button 을 감싼다. */
const Trigger = DialogPrimitive.Trigger;
/** 시트를 닫는 요소. 보통 `asChild` 로 Button 을 감싼다. */
const Close = DialogPrimitive.Close;

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export type SheetSide = 'right' | 'left' | 'top' | 'bottom';
export type SheetSize = 'sm' | 'md' | 'lg' | 'full';

export interface SheetContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  /** 시트가 붙는 화면 가장자리. @default 'right' */
  side?: SheetSide;
  /**
   * 좌우 시트는 너비(sm 20rem · md 24rem · lg 32rem), 상하 시트는 최대 높이(sm 33% · md 50% · lg 75%).
   * `full` 은 화면 전체. @default 'md'
   */
  size?: SheetSize;
  /** 닫기 버튼을 숨긴다. 숨기면 Footer 등에 닫는 수단을 반드시 둔다. @default false */
  hideCloseButton?: boolean;
  /** 닫기 버튼의 접근 가능한 이름. @default '닫기' */
  closeLabel?: string;
  /** 포털을 렌더링할 컨테이너. @default document.body */
  container?: HTMLElement | null;
}

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
  </svg>
);

/**
 * 화면 가장자리에서 미끄러져 나오는 패널. 모달이면 포털·오버레이·포커스 트랩·스크롤 잠금·
 * Esc 닫기·포커스 복귀를 포함한다. 반드시 `Sheet.Title` 을 포함한다.
 * 설명이 없으면 `aria-describedby={undefined}` 를 넘긴다.
 */
const Content = React.forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  {
    side = 'right',
    size = 'md',
    hideCloseButton = false,
    closeLabel = '닫기',
    container,
    className,
    children,
    ...rest
  },
  ref,
) {
  const modal = React.useContext(SheetModalContext);
  return (
    <DialogPrimitive.Portal container={container}>
      {modal && <DialogPrimitive.Overlay className="hds-sheet__overlay" />}
      <DialogPrimitive.Content
        {...rest}
        ref={ref}
        className={cx('hds-sheet', className)}
        data-side={side}
        data-size={size}
        data-modal={modal ? '' : undefined}
      >
        {children}
        {/* DOM 상 마지막에 두어 열릴 때 본문 첫 요소로 포커스가 가게 한다 (위치는 CSS 로 우측 상단) */}
        {!hideCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton aria-label={closeLabel} size="sm" className="hds-sheet__close">
              <CloseIcon />
            </IconButton>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Header · Body · Footer
 * -----------------------------------------------------------------------------------------------*/

export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const Header = React.forwardRef<HTMLDivElement, SheetHeaderProps>(function SheetHeader(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hds-sheet__header', className)} />;
});

export type SheetBodyProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * 스크롤 영역. 내용이 넘치면 이 영역만 스크롤되고,
 * 넘칠 때는 키보드로도 스크롤할 수 있도록 자동으로 포커스 가능해진다 (WCAG 2.1.1).
 */
const Body = React.forwardRef<HTMLDivElement, SheetBodyProps>(function SheetBody(
  { className, tabIndex, ...rest },
  forwardedRef,
) {
  const [overflowRef, overflowing] = useScrollOverflow<HTMLDivElement>('vertical');
  const ref = useMergedRef(overflowRef, forwardedRef);
  return (
    <div
      {...rest}
      ref={ref}
      tabIndex={tabIndex ?? (overflowing ? 0 : undefined)}
      className={cx('hds-sheet__body', className)}
      data-overflowing={overflowing ? '' : undefined}
    />
  );
});

export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** 동작 버튼 영역. 시트 아래쪽에 고정된다. */
const Footer = React.forwardRef<HTMLDivElement, SheetFooterProps>(function SheetFooter(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hds-sheet__footer', className)} />;
});

/* -------------------------------------------------------------------------------------------------
 * Title · Description
 * -----------------------------------------------------------------------------------------------*/

export type SheetTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

/** 시트의 접근 가능한 이름 (`aria-labelledby` 로 자동 연결). */
const Title = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(function SheetTitle(
  { className, ...rest },
  ref,
) {
  return (
    <DialogPrimitive.Title {...rest} ref={ref} className={cx('hds-sheet__title', className)} />
  );
});

export type SheetDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/** 시트의 접근 가능한 설명 (`aria-describedby` 로 자동 연결). */
const Description = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  function SheetDescription({ className, ...rest }, ref) {
    return (
      <DialogPrimitive.Description
        {...rest}
        ref={ref}
        className={cx('hds-sheet__description', className)}
      />
    );
  },
);

export { Root, Trigger, Close, Content, Header, Body, Footer, Title, Description };
