import * as React from 'react';
import { cx } from '../utils/cx';

export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';
export type PaginationSize = 'sm' | 'md';

const range = (start: number, end: number): number[] =>
  end < start ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * 보여줄 페이지 번호와 생략 위치를 계산한다.
 * 항목 수가 페이지가 바뀌어도 일정하도록 생략 자리를 페이지 번호로 채우기도 한다 (버튼 위치가 덜 흔들린다).
 *
 * @example paginationRange({ page: 6, count: 20 }) // [1, 'ellipsis-start', 5, 6, 7, 'ellipsis-end', 20]
 */
export function paginationRange({
  page,
  count,
  siblingCount = 1,
  boundaryCount = 1,
}: {
  page: number;
  count: number;
  siblingCount?: number;
  boundaryCount?: number;
}): PaginationItem[] {
  if (count <= 0) return [];
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : count - 1,
  );

  const items: PaginationItem[] = [...startPages];

  if (siblingsStart > boundaryCount + 2) items.push('ellipsis-start');
  else if (boundaryCount + 1 < count - boundaryCount) items.push(boundaryCount + 1);

  items.push(...range(siblingsStart, siblingsEnd));

  if (siblingsEnd < count - boundaryCount - 1) items.push('ellipsis-end');
  else if (count - boundaryCount > boundaryCount) items.push(count - boundaryCount);

  items.push(...endPages);

  // 페이지 수가 적을 때 생길 수 있는 중복·범위 밖 번호를 정리한다
  const seen = new Set<PaginationItem>();
  return items.filter((item) => {
    if (typeof item === 'number' && (item < 1 || item > count)) return false;
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

export interface PaginationLabels {
  /** @default '이전' */
  previous?: string;
  /** @default '다음' */
  next?: string;
  /** 페이지 버튼의 접근 가능한 이름. 보이는 숫자를 포함해야 한다 (WCAG 2.5.3). @default (p) => `${p} 페이지` (숫자를 독립된 단어로 두어 음성 명령·WCAG 2.5.3 검사에서 일치하게) */
  page?: (page: number) => string;
}

export interface PaginationProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'onChange' | 'children'
> {
  /** 전체 페이지 수. */
  count: number;
  /** 현재 페이지 (제어 모드). 1부터 시작한다. */
  page?: number;
  /** 처음 페이지 (비제어 모드). @default 1 */
  defaultPage?: number;
  /** 페이지가 바뀔 때. 버튼으로 렌더링하는 경우에 쓴다. */
  onPageChange?: (page: number) => void;
  /**
   * 주면 각 페이지를 링크(`<a href>`)로 렌더링한다. 검색 결과처럼 페이지마다 URL 이 있으면 링크가 맞다
   * (새 탭 열기, 주소 공유가 된다).
   */
  getHref?: (page: number) => string;
  /** 링크로 렌더링할 때 쓸 컴포넌트 (예: Next.js `Link`). @default 'a' */
  linkAs?: React.ElementType;
  /** 현재 페이지 양옆에 보여줄 페이지 수. @default 1 */
  siblingCount?: number;
  /** 처음과 끝에 항상 보여줄 페이지 수. @default 1 */
  boundaryCount?: number;
  /** @default 'md' */
  size?: PaginationSize;
  /** 내비게이션 랜드마크의 이름. @default '페이지 이동' */
  'aria-label'?: string;
  /** 버튼 문구와 접근 가능한 이름. */
  labels?: PaginationLabels;
}

const ChevronLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M10 3.5 5.5 8l4.5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="m6 3.5 4.5 4.5L6 12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** 여러 페이지로 나뉜 목록 사이를 이동한다. */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    count,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    getHref,
    linkAs: LinkComp = 'a',
    siblingCount = 1,
    boundaryCount = 1,
    size = 'md',
    'aria-label': ariaLabel = '페이지 이동',
    labels,
    className,
    ...rest
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultPage);
  const controlled = pageProp !== undefined;
  const current = Math.min(Math.max(controlled ? pageProp : uncontrolled, 1), Math.max(count, 1));

  const previousLabel = labels?.previous ?? '이전';
  const nextLabel = labels?.next ?? '다음';
  const pageLabel = labels?.page ?? ((p: number) => `${p} 페이지`);

  const go = (target: number) => {
    if (target < 1 || target > count || target === current) return;
    if (!controlled) setUncontrolled(target);
    onPageChange?.(target);
  };

  const renderControl = ({
    target,
    disabled,
    isCurrent,
    label,
    content,
    kind,
  }: {
    target: number;
    disabled?: boolean;
    isCurrent?: boolean;
    label?: string;
    content: React.ReactNode;
    kind: 'page' | 'previous' | 'next';
  }) => {
    const common = {
      className: 'hds-pagination__control',
      'data-kind': kind,
      'aria-label': label,
      'aria-current': isCurrent ? ('page' as const) : undefined,
    };
    if (getHref) {
      if (disabled) {
        // href 없는 링크는 포커스되지 않는다. role 로 링크임은 유지하고 비활성을 알린다.
        return (
          <a {...common} role="link" aria-disabled="true">
            {content}
          </a>
        );
      }
      return (
        <LinkComp
          {...common}
          href={getHref(target)}
          onClick={() => {
            if (!controlled) setUncontrolled(target);
            onPageChange?.(target);
          }}
        >
          {content}
        </LinkComp>
      );
    }
    return (
      <button {...common} type="button" disabled={disabled} onClick={() => go(target)}>
        {content}
      </button>
    );
  };

  const items = paginationRange({ page: current, count, siblingCount, boundaryCount });

  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={ariaLabel}
      className={cx('hds-pagination', className)}
      data-size={size}
    >
      <ul className="hds-pagination__list">
        <li>
          {renderControl({
            target: current - 1,
            disabled: current <= 1,
            kind: 'previous',
            content: (
              <>
                <ChevronLeft />
                <span className="hds-pagination__step-label">{previousLabel}</span>
              </>
            ),
          })}
        </li>
        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              {renderControl({
                target: item,
                isCurrent: item === current,
                label: pageLabel(item),
                kind: 'page',
                content: item,
              })}
            </li>
          ) : (
            <li key={item} className="hds-pagination__ellipsis" aria-hidden="true">
              …
            </li>
          ),
        )}
        <li>
          {renderControl({
            target: current + 1,
            disabled: current >= count,
            kind: 'next',
            content: (
              <>
                <span className="hds-pagination__step-label">{nextLabel}</span>
                <ChevronRight />
              </>
            ),
          })}
        </li>
      </ul>
    </nav>
  );
});
