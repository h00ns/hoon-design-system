import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { IconButton } from '../icon-button/IconButton';
import { cx } from '../utils/cx';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';

/* -------------------------------------------------------------------------------------------------
 * Root · Trigger · Close
 * -----------------------------------------------------------------------------------------------*/

export type DialogRootProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
export type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

/** 다이얼로그의 열림 상태를 관리한다. `open`/`onOpenChange`(제어) 또는 `defaultOpen`(비제어). */
const Root = DialogPrimitive.Root;
/** 다이얼로그를 여는 요소. 보통 `asChild` 로 Button 을 감싼다. */
const Trigger = DialogPrimitive.Trigger;
/** 다이얼로그를 닫는 요소. 보통 `asChild` 로 Button 을 감싼다. */
const Close = DialogPrimitive.Close;

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export type DialogSize = 'sm' | 'md' | 'lg' | 'full';

export interface DialogContentProps extends React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> {
  /** 너비. 작은 화면(640px 미만)에서는 모든 크기가 하단 시트로 바뀌고 `full` 은 전체 화면이 된다. @default 'md' */
  size?: DialogSize;
  /** 우측 상단 닫기 버튼을 숨긴다. 숨기면 Footer 등에 닫는 수단을 반드시 둔다. @default false */
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
 * 모달 다이얼로그 본체. 포털·오버레이·포커스 트랩·스크롤 잠금·Esc 닫기·포커스 복귀를 포함한다.
 * 반드시 `Dialog.Title` 을 포함한다 (보이지 않게 하려면 VisuallyHidden 으로 감싼다).
 * 설명이 없으면 `aria-describedby={undefined}` 를 넘긴다.
 */
const Content = React.forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  {
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
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Overlay className="hds-dialog__overlay" />
      <DialogPrimitive.Content
        {...rest}
        ref={ref}
        className={cx('hds-dialog', className)}
        data-size={size}
      >
        {children}
        {/* DOM 상 마지막에 두어 열릴 때 본문 첫 요소로 포커스가 가게 한다 (위치는 CSS 로 우측 상단) */}
        {!hideCloseButton && (
          <DialogPrimitive.Close asChild>
            <IconButton aria-label={closeLabel} size="sm" className="hds-dialog__close">
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

export type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;

const Header = React.forwardRef<HTMLDivElement, DialogHeaderProps>(function DialogHeader(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hds-dialog__header', className)} />;
});

export type DialogBodyProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * 스크롤 영역. 내용이 넘치면 페이지가 아니라 이 영역만 스크롤된다.
 * 넘칠 때는 키보드로도 스크롤할 수 있도록 자동으로 포커스 가능해진다 (WCAG 2.1.1).
 */
const Body = React.forwardRef<HTMLDivElement, DialogBodyProps>(function DialogBody(
  { className, tabIndex, ...rest },
  forwardedRef,
) {
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  const [overflowing, setOverflowing] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    const update = () => setOverflowing(node.scrollHeight > node.clientHeight + 1);
    update();
    // 영역 크기 변화(창 크기)와 내용 변화(비동기 로딩 등) 모두에 반응한다
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update);
    resizeObserver?.observe(node);
    const mutationObserver =
      typeof MutationObserver === 'undefined' ? undefined : new MutationObserver(update);
    mutationObserver?.observe(node, { childList: true, subtree: true, characterData: true });
    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, []);

  const ref = React.useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  return (
    <div
      {...rest}
      ref={ref}
      tabIndex={tabIndex ?? (overflowing ? 0 : undefined)}
      className={cx('hds-dialog__body', className)}
      data-overflowing={overflowing ? '' : undefined}
    />
  );
});

export type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** 동작 버튼 영역. 작은 화면에서는 버튼이 세로로 쌓이고 주요 버튼이 위로 온다. */
const Footer = React.forwardRef<HTMLDivElement, DialogFooterProps>(function DialogFooter(
  { className, ...rest },
  ref,
) {
  return <div {...rest} ref={ref} className={cx('hds-dialog__footer', className)} />;
});

/* -------------------------------------------------------------------------------------------------
 * Title · Description
 * -----------------------------------------------------------------------------------------------*/

export type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

/** 다이얼로그의 접근 가능한 이름 (`aria-labelledby` 로 자동 연결). */
const Title = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(function DialogTitle(
  { className, ...rest },
  ref,
) {
  return (
    <DialogPrimitive.Title {...rest} ref={ref} className={cx('hds-dialog__title', className)} />
  );
});

export type DialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/** 다이얼로그의 접근 가능한 설명 (`aria-describedby` 로 자동 연결). */
const Description = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription({ className, ...rest }, ref) {
    return (
      <DialogPrimitive.Description
        {...rest}
        ref={ref}
        className={cx('hds-dialog__description', className)}
      />
    );
  },
);

export { Root, Trigger, Close, Content, Header, Body, Footer, Title, Description };
