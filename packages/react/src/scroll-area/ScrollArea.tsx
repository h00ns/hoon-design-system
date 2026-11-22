import * as React from 'react';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
import { cx } from '../utils/cx';
import { useMergedRef, useScrollOverflow } from '../utils/use-scroll-overflow';

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both';

export interface ScrollAreaProps extends React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> {
  /** 스크롤 방향. @default 'vertical' */
  orientation?: ScrollAreaOrientation;
  /**
   * 스크롤바를 언제 보여줄지.
   * `hover`(포인터를 올렸을 때) · `scroll`(스크롤하는 동안) · `auto`(넘칠 때 항상) · `always`.
   * @default 'hover'
   */
  type?: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>['type'];
  /**
   * 스크롤 영역의 이름. 주면 뷰포트가 `role="region"` 이 되어
   * 스크린리더 사용자가 랜드마크로 찾아갈 수 있다. 넘치는 영역에는 이름을 주는 것을 권장한다.
   */
  'aria-label'?: string;
  /** `aria-label` 대신 화면에 보이는 제목의 id 로 이름을 준다. */
  'aria-labelledby'?: string;
  /** 실제로 스크롤되는 뷰포트 요소의 ref (스크롤 위치 제어용). */
  viewportRef?: React.Ref<HTMLDivElement>;
}

/**
 * 플랫폼과 무관하게 같은 모양의 스크롤바를 그리는 스크롤 영역.
 * 스크롤 자체는 브라우저 기본 동작이라 휠·터치·키보드가 그대로 동작하고,
 * 내용이 넘치면 뷰포트가 포커스 가능해져 키보드로도 스크롤할 수 있다 (WCAG 2.1.1).
 * 높이(또는 너비)는 `className`/`style` 로 제한한다.
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  {
    orientation = 'vertical',
    type = 'hover',
    className,
    children,
    viewportRef,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  },
  ref,
) {
  const [overflowRef, overflowing] = useScrollOverflow<HTMLDivElement>(orientation);
  const mergedViewportRef = useMergedRef(overflowRef, viewportRef);
  const named = Boolean(ariaLabel || ariaLabelledBy);

  return (
    <ScrollAreaPrimitive.Root
      {...rest}
      ref={ref}
      type={type}
      className={cx('hds-scroll-area', className)}
      data-orientation={orientation}
    >
      <ScrollAreaPrimitive.Viewport
        ref={mergedViewportRef}
        className="hds-scroll-area__viewport"
        // 넘칠 때만 탭 순서에 넣는다. 이름이 있으면 영역 랜드마크로 노출한다.
        tabIndex={overflowing ? 0 : undefined}
        role={named ? 'region' : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation !== 'horizontal' && (
        <ScrollAreaPrimitive.Scrollbar
          orientation="vertical"
          className="hds-scroll-area__scrollbar"
        >
          <ScrollAreaPrimitive.Thumb className="hds-scroll-area__thumb" />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      {orientation !== 'vertical' && (
        <ScrollAreaPrimitive.Scrollbar
          orientation="horizontal"
          className="hds-scroll-area__scrollbar"
        >
          <ScrollAreaPrimitive.Thumb className="hds-scroll-area__thumb" />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      {orientation === 'both' && <ScrollAreaPrimitive.Corner className="hds-scroll-area__corner" />}
    </ScrollAreaPrimitive.Root>
  );
});
