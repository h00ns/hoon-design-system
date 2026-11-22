import * as React from 'react';
import { Toggle as TogglePrimitive } from 'radix-ui';
import { cx } from '../utils/cx';
import { ToggleContent } from './toggle-content';

export type ToggleSize = 'sm' | 'md' | 'lg';

/**
 * 내용 규칙: 텍스트가 있으면 아이콘은 선택, 아이콘만 있으면 `aria-label` 이 필수다.
 * (아이콘만으로는 이름이 없으므로 타입 단계에서 막는다)
 */
export type ToggleContentProps =
  | {
      /** 보이는 텍스트 */
      children: React.ReactNode;
      /** 텍스트 앞에 붙는 장식용 아이콘. 보조기기에서는 숨겨진다. */
      icon?: React.ReactNode;
      'aria-label'?: string;
    }
  | {
      children?: undefined;
      /** 장식용 아이콘. 아이콘만 있을 때는 `aria-label` 이 필수다. */
      icon: React.ReactNode;
      'aria-label': string;
    };

type PrimitiveToggleProps = Omit<
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
  'asChild' | 'children' | 'aria-label'
>;

export type ToggleProps = PrimitiveToggleProps &
  ToggleContentProps & {
    /** @default 'md' */
    size?: ToggleSize;
  };

/**
 * 켜고 끄는 버튼 (`aria-pressed`). 굵게·기울임, 즐겨찾기처럼 상태를 바로 바꾸는 도구에 쓴다.
 * 설정값을 켜고 끄는 것이라면 Switch 가 더 분명하다.
 */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { size = 'md', className, icon, children, ...rest },
  ref,
) {
  return (
    <TogglePrimitive.Root
      {...rest}
      ref={ref}
      className={cx('hds-toggle', className)}
      data-size={size}
      data-icon-only={children == null ? '' : undefined}
    >
      <ToggleContent icon={icon}>{children}</ToggleContent>
    </TogglePrimitive.Root>
  );
});
