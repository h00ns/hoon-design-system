import * as React from 'react';
import { Slot } from 'radix-ui';
import { cx } from '../utils/cx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'critical';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 시각적 위계. @default 'primary' */
  variant?: ButtonVariant;
  /** 크기. 모든 크기가 WCAG 2.5.8 최소 타깃(24×24px) 이상이다. @default 'md' */
  size?: ButtonSize;
  /**
   * 진행 중 상태. 스피너를 보여주고 클릭을 막지만 포커스와 접근 가능한 이름은 유지한다.
   * 작업 결과(성공/실패)는 토스트나 live region 으로 따로 알려야 한다.
   */
  loading?: boolean;
  /**
   * 비활성 상태에서도 Tab 으로 포커스할 수 있게 한다 (`disabled` 대신 `aria-disabled` 사용).
   * 비활성 이유를 툴팁으로 설명해야 하거나, 스크린리더 사용자가 버튼의 존재를 알아야 할 때 쓴다.
   * @default false
   */
  focusableWhenDisabled?: boolean;
  /**
   * 자식 요소를 루트로 렌더링한다 (예: `<a>`, 라우터 `<Link>`).
   * 이때 `type` 은 붙지 않고, 비활성은 항상 `aria-disabled` 로 표현된다.
   */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    focusableWhenDisabled = false,
    asChild = false,
    type,
    className,
    children,
    onClick,
    'aria-disabled': ariaDisabledProp,
    ...rest
  },
  ref,
) {
  // 소비자가 aria-disabled 를 직접 넘긴 경우도 비활성으로 취급한다
  const ariaDisabled = ariaDisabledProp === true || ariaDisabledProp === 'true';
  const inactive = disabled || loading || ariaDisabled;
  // 네이티브 disabled 는 포커스를 빼앗는다. 로딩 중(포커스 유실 방지)·asChild(<a> 등은 disabled 미지원)·
  // focusableWhenDisabled 일 때는 aria-disabled 로 대신한다.
  const nativeDisabled =
    disabled && !loading && !ariaDisabled && !focusableWhenDisabled && !asChild;
  const Comp = asChild ? Slot.Root : 'button';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (inactive) {
      // 폼 제출·링크 이동까지 막는다
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  return (
    <Comp
      {...rest}
      ref={ref}
      className={cx('hds-button', className)}
      data-variant={variant}
      data-size={size}
      data-loading={loading ? '' : undefined}
      // 폼 안에서 의도치 않은 제출을 막기 위해 기본값은 submit 이 아니라 button
      type={asChild ? undefined : (type ?? 'button')}
      disabled={nativeDisabled || undefined}
      aria-disabled={inactive && !nativeDisabled ? true : undefined}
      aria-busy={loading || undefined}
      onClick={handleClick}
    >
      {loading && <span className="hds-button__spinner" aria-hidden="true" />}
      <Slot.Slottable>{children}</Slot.Slottable>
    </Comp>
  );
});
