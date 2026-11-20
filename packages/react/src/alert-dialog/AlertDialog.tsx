import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';
import { Button } from '../button/Button';
import type { ButtonProps } from '../button/Button';
import { cx } from '../utils/cx';

/* -------------------------------------------------------------------------------------------------
 * Root · Trigger
 * -----------------------------------------------------------------------------------------------*/

export type AlertDialogRootProps = React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>;
export type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Trigger
>;

/** 확인 다이얼로그의 열림 상태를 관리한다. */
const Root = AlertDialogPrimitive.Root;
/** 확인 다이얼로그를 여는 요소. 보통 `asChild` 로 Button 을 감싼다. */
const Trigger = AlertDialogPrimitive.Trigger;

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

export interface AlertDialogContentProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Content
> {
  /** 포털을 렌더링할 컨테이너. @default document.body */
  container?: HTMLElement | null;
}

/**
 * 사용자의 확인이 필요한 중단형 다이얼로그 (`role="alertdialog"`).
 * 바깥 클릭으로 닫히지 않고, 열리면 가장 안전한 동작인 Cancel 로 포커스가 간다.
 */
const Content = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ container, className, ...rest }, ref) {
    return (
      <AlertDialogPrimitive.Portal container={container}>
        <AlertDialogPrimitive.Overlay className="hds-dialog__overlay" />
        <AlertDialogPrimitive.Content
          {...rest}
          ref={ref}
          className={cx('hds-dialog', 'hds-alert-dialog', className)}
          data-size="sm"
        />
      </AlertDialogPrimitive.Portal>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Title · Description · Footer
 * -----------------------------------------------------------------------------------------------*/

export type AlertDialogTitleProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Title
>;

/** 무엇을 확인하는지 묻는 제목. 접근 가능한 이름으로 자동 연결된다. */
const Title = React.forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(function AlertDialogTitle(
  { className, ...rest },
  ref,
) {
  return (
    <AlertDialogPrimitive.Title
      {...rest}
      ref={ref}
      className={cx('hds-dialog__title', 'hds-alert-dialog__title', className)}
    />
  );
});

export type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPrimitive.Description
>;

/** 결과를 설명하는 문장. 스크린리더가 열릴 때 함께 읽는다. */
const Description = React.forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  function AlertDialogDescription({ className, ...rest }, ref) {
    return (
      <AlertDialogPrimitive.Description
        {...rest}
        ref={ref}
        className={cx('hds-dialog__description', 'hds-alert-dialog__description', className)}
      />
    );
  },
);

export type AlertDialogFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Cancel · Action 버튼 영역. */
const Footer = React.forwardRef<HTMLDivElement, AlertDialogFooterProps>(function AlertDialogFooter(
  { className, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('hds-dialog__footer', 'hds-alert-dialog__footer', className)}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Cancel · Action
 * -----------------------------------------------------------------------------------------------*/

export type AlertDialogCancelProps = Omit<ButtonProps, 'asChild'>;

/** 취소 버튼. 다이얼로그가 열리면 이 버튼으로 포커스가 간다. @default variant 'secondary' */
const Cancel = React.forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  function AlertDialogCancel({ variant = 'secondary', ...rest }, ref) {
    return (
      <AlertDialogPrimitive.Cancel asChild>
        <Button {...rest} ref={ref} variant={variant} />
      </AlertDialogPrimitive.Cancel>
    );
  },
);

export type AlertDialogActionProps = Omit<ButtonProps, 'asChild'>;

/**
 * 확인 버튼. 누르면 `onClick` 후 다이얼로그가 닫힌다.
 * 비동기 작업 동안 열어두려면 `onClick` 에서 `event.preventDefault()` 를 호출하고 `open` 을 직접 제어한다.
 * 되돌릴 수 없는 동작이면 `variant="danger"`. @default variant 'primary'
 */
const Action = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  function AlertDialogAction({ variant = 'primary', ...rest }, ref) {
    return (
      <AlertDialogPrimitive.Action asChild>
        <Button {...rest} ref={ref} variant={variant} />
      </AlertDialogPrimitive.Action>
    );
  },
);

export { Root, Trigger, Content, Title, Description, Footer, Cancel, Action };
