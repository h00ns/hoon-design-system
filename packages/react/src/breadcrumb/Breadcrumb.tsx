import * as React from 'react';
import { Slot } from 'radix-ui';
import { cx } from '../utils/cx';

/* -------------------------------------------------------------------------------------------------
 * Root / List / Item
 * -----------------------------------------------------------------------------------------------*/

export interface BreadcrumbRootProps extends React.HTMLAttributes<HTMLElement> {
  /** 내비게이션 랜드마크의 이름. @default '현재 위치' */
  'aria-label'?: string;
}

/** 현재 페이지의 위치를 상위 경로와 함께 보여주는 내비게이션 (`<nav>`). */
const Root = React.forwardRef<HTMLElement, BreadcrumbRootProps>(function BreadcrumbRoot(
  { 'aria-label': ariaLabel = '현재 위치', className, ...rest },
  ref,
) {
  return (
    <nav {...rest} ref={ref} aria-label={ariaLabel} className={cx('hds-breadcrumb', className)} />
  );
});

export type BreadcrumbListProps = React.OlHTMLAttributes<HTMLOListElement>;

/** 경로 순서가 의미를 가지므로 순서 있는 목록(`<ol>`)이다. */
const List = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(function BreadcrumbList(
  { className, ...rest },
  ref,
) {
  return <ol {...rest} ref={ref} className={cx('hds-breadcrumb__list', className)} />;
});

export type BreadcrumbItemProps = React.LiHTMLAttributes<HTMLLIElement>;

const Item = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { className, ...rest },
  ref,
) {
  return <li {...rest} ref={ref} className={cx('hds-breadcrumb__item', className)} />;
});

/* -------------------------------------------------------------------------------------------------
 * Link / Page
 * -----------------------------------------------------------------------------------------------*/

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** 라우터의 `<Link>` 등을 루트로 렌더링한다. */
  asChild?: boolean;
}

const Link = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(function BreadcrumbLink(
  { asChild = false, className, ...rest },
  ref,
) {
  const Comp = asChild ? Slot.Root : 'a';
  return <Comp {...rest} ref={ref} className={cx('hds-breadcrumb__link', className)} />;
});

export type BreadcrumbPageProps = React.HTMLAttributes<HTMLSpanElement>;

/** 현재 페이지. 링크가 아니며 `aria-current="page"` 로 현재 위치임을 알린다. */
const Page = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(function BreadcrumbPage(
  { className, ...rest },
  ref,
) {
  return (
    <span
      {...rest}
      ref={ref}
      aria-current="page"
      className={cx('hds-breadcrumb__page', className)}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Separator
 * -----------------------------------------------------------------------------------------------*/

export type BreadcrumbSeparatorProps = React.LiHTMLAttributes<HTMLLIElement>;

const ChevronIcon = () => (
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

/** 항목 사이 구분자. 장식이므로 보조기기에서 숨긴다. 기본 모양은 `›` 화살표. */
const Separator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator({ className, children, ...rest }, ref) {
    return (
      <li
        {...rest}
        ref={ref}
        role="presentation"
        aria-hidden="true"
        className={cx('hds-breadcrumb__separator', className)}
      >
        {children ?? <ChevronIcon />}
      </li>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Ellipsis
 * -----------------------------------------------------------------------------------------------*/

export interface BreadcrumbEllipsisProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼의 접근 가능한 이름. @default '숨겨진 경로 보기' */
  'aria-label'?: string;
}

/**
 * 중간 경로를 접어 둔 자리에 두는 버튼. DropdownMenu 의 Trigger 로 감싸 접힌 경로를 메뉴로 보여준다:
 * `<DropdownMenu.Trigger asChild><Breadcrumb.Ellipsis /></DropdownMenu.Trigger>`
 */
const Ellipsis = React.forwardRef<HTMLButtonElement, BreadcrumbEllipsisProps>(
  function BreadcrumbEllipsis(
    { 'aria-label': ariaLabel = '숨겨진 경로 보기', type = 'button', className, ...rest },
    ref,
  ) {
    return (
      <button
        {...rest}
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        className={cx('hds-breadcrumb__ellipsis', className)}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="3.5" cy="8" r="1.25" />
          <circle cx="8" cy="8" r="1.25" />
          <circle cx="12.5" cy="8" r="1.25" />
        </svg>
      </button>
    );
  },
);

export { Root, List, Item, Link, Page, Separator, Ellipsis };
