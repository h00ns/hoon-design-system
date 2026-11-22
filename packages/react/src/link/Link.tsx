import * as React from 'react';
import { Slot } from 'radix-ui';
import { cx } from '../utils/cx';

export type LinkVariant = 'default' | 'subtle';
export type LinkUnderline = 'always' | 'hover';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `default`: 강조색 · `subtle`: 본문색. @default 'default' */
  variant?: LinkVariant;
  /**
   * 밑줄 표시. 문장 속 링크는 색만으로 구분하면 안 되므로(WCAG 1.4.1) 기본은 항상 밑줄이다.
   * `hover` 는 내비게이션처럼 맥락상 링크임이 분명한 곳에서만 쓴다.
   * @default 'always'
   */
  underline?: LinkUnderline;
  /**
   * 새 창(탭)으로 여는 외부 링크. `target="_blank"` 와 `rel="noopener noreferrer"` 를 붙이고,
   * 아이콘과 스크린리더용 안내 문구를 덧붙인다. `target="_blank"` 를 직접 넘겨도 같다.
   * @default false
   */
  external?: boolean;
  /** 새 창으로 열린다는 스크린리더 안내 문구. @default '(새 창)' */
  newTabLabel?: string;
  /** 라우터의 `<Link>` 등을 루트로 렌더링한다. */
  asChild?: boolean;
}

const ExternalIcon = () => (
  <svg className="hds-link__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M6.5 3.5H4A1.5 1.5 0 0 0 2.5 5v7A1.5 1.5 0 0 0 4 13.5h7a1.5 1.5 0 0 0 1.5-1.5V9.5M9.5 2.5h4v4M13.5 2.5 7.5 8.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 문장 안이나 단독으로 쓰는 텍스트 링크. 동작을 실행한다면 Button 을 쓴다. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    variant = 'default',
    underline = 'always',
    external = false,
    newTabLabel = '(새 창)',
    asChild = false,
    target,
    rel,
    className,
    children,
    ...rest
  },
  ref,
) {
  const opensNewTab = external || target === '_blank';
  const Comp = asChild ? Slot.Root : 'a';
  return (
    <Comp
      {...rest}
      ref={ref}
      className={cx('hds-link', className)}
      data-variant={variant}
      data-underline={underline}
      data-external={opensNewTab ? '' : undefined}
      target={opensNewTab ? '_blank' : target}
      rel={opensNewTab ? (rel ?? 'noopener noreferrer') : rel}
    >
      <Slot.Slottable>{children}</Slot.Slottable>
      {opensNewTab && (
        <>
          <ExternalIcon />
          {/* 앞 공백: 접근 가능한 이름이 "문서(새 창)" 처럼 붙어 읽히지 않도록 */}
          <span className="hds-visually-hidden"> {newTabLabel}</span>
        </>
      )}
    </Comp>
  );
});
