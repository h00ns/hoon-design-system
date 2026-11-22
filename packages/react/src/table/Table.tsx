import * as React from 'react';
import { cx } from '../utils/cx';
import { useIsomorphicLayoutEffect } from '../utils/use-isomorphic-layout-effect';

export type TableDensity = 'default' | 'compact';
export type TableAlign = 'start' | 'center' | 'end';
export type TableSortDirection = 'ascending' | 'descending' | 'none';

/* -------------------------------------------------------------------------------------------------
 * Context
 * -----------------------------------------------------------------------------------------------*/

interface TableContextValue {
  captionId: string;
  setHasCaption: (value: boolean) => void;
  announce: (message: string) => void;
  sortAnnouncement: (column: string, direction: Exclude<TableSortDirection, 'none'>) => string;
}

const TableContext = React.createContext<TableContextValue | null>(null);

const defaultSortAnnouncement = (column: string, direction: Exclude<TableSortDirection, 'none'>) =>
  `${column} 열 ${direction === 'ascending' ? '오름차순' : '내림차순'} 정렬됨`;

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

export interface TableRootProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** 행 높이. 데이터가 많은 화면은 `compact`. @default 'default' */
  density?: TableDensity;
  /** 짝수 행에 옅은 배경을 깐다. 열이 많아 행을 따라 읽기 어려울 때. @default false */
  striped?: boolean;
  /**
   * 세로로 스크롤할 때 머리 행을 위에 고정한다. 스크롤 컨테이너에 높이 제한이 있어야 한다
   * (`containerProps={{ style: { maxHeight: 400 } }}`).
   * @default false
   */
  stickyHeader?: boolean;
  /** 표를 감싸는 스크롤 컨테이너(`div`)에 전달할 속성. */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * 정렬이 바뀔 때 스크린리더에 알릴 문구.
   * @default (열, 방향) => `${열} 열 오름차순 정렬됨`
   */
  sortAnnouncement?: (column: string, direction: Exclude<TableSortDirection, 'none'>) => string;
}

/**
 * 데이터 표. 표가 컨테이너보다 넓어지면 스크롤 영역이 **키보드로 포커스 가능**해지고
 * 캡션(또는 `aria-label`)을 이름으로 갖는 영역(region)이 된다. 키보드 사용자가 화살표로 스크롤할 수 있다.
 */
const Root = React.forwardRef<HTMLTableElement, TableRootProps>(function TableRoot(
  {
    density = 'default',
    striped = false,
    stickyHeader = false,
    containerProps,
    sortAnnouncement = defaultSortAnnouncement,
    className,
    children,
    ...rest
  },
  ref,
) {
  const baseId = React.useId();
  const captionId = `${baseId}-caption`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hasCaption, setHasCaption] = React.useState(false);
  const [overflowing, setOverflowing] = React.useState(false);
  const [message, setMessage] = React.useState('');

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () =>
      setOverflowing(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);

  const announce = React.useCallback((text: string) => {
    // 같은 문구가 연속으로 와도 읽히도록 한 번 비웠다가 채운다
    setMessage('');
    requestAnimationFrame(() => setMessage(text));
  }, []);

  const value = React.useMemo<TableContextValue>(
    () => ({ captionId, setHasCaption, announce, sortAnnouncement }),
    [captionId, announce, sortAnnouncement],
  );

  const regionLabelProps = overflowing
    ? hasCaption
      ? { 'aria-labelledby': captionId }
      : { 'aria-label': rest['aria-label'] }
    : {};

  return (
    <TableContext.Provider value={value}>
      <div
        {...containerProps}
        ref={containerRef}
        className={cx('hds-table', containerProps?.className)}
        data-density={density}
        data-striped={striped ? '' : undefined}
        data-sticky-header={stickyHeader ? '' : undefined}
        // 넘칠 때만 포커스 가능한 스크롤 영역(role="region")이 된다 (WCAG 2.1.1: 키보드로 스크롤).
        // role 이 동적이라 린트가 판별하지 못한다. axe 의 scrollable-region-focusable 권장 패턴이다.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={overflowing ? 0 : containerProps?.tabIndex}
        role={overflowing ? 'region' : containerProps?.role}
        {...regionLabelProps}
      >
        <table {...rest} ref={ref} className={cx('hds-table__table', className)}>
          {children}
        </table>
        <span className="hds-visually-hidden" role="status">
          {message}
        </span>
      </div>
    </TableContext.Provider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Caption
 * -----------------------------------------------------------------------------------------------*/

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  /** 화면에서는 숨기고 스크린리더에만 노출한다 (표 위에 이미 제목이 보일 때). @default false */
  visuallyHidden?: boolean;
}

/** 표의 이름. 스크린리더가 표에 들어갈 때 읽는다. 가능하면 항상 둔다. */
const Caption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(function TableCaption(
  { visuallyHidden = false, className, ...rest },
  ref,
) {
  const ctx = React.useContext(TableContext);
  const setHasCaption = ctx?.setHasCaption;
  useIsomorphicLayoutEffect(() => {
    setHasCaption?.(true);
    return () => setHasCaption?.(false);
  }, [setHasCaption]);
  return (
    <caption
      {...rest}
      ref={ref}
      id={ctx?.captionId ?? rest.id}
      className={cx('hds-table__caption', visuallyHidden && 'hds-visually-hidden', className)}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Sections / Row
 * -----------------------------------------------------------------------------------------------*/

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
const Header = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, ...rest },
  ref,
) {
  return <thead {...rest} ref={ref} className={cx('hds-table__header', className)} />;
});

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
const Body = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...rest },
  ref,
) {
  return <tbody {...rest} ref={ref} className={cx('hds-table__body', className)} />;
});

export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>;
const Footer = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(function TableFooter(
  { className, ...rest },
  ref,
) {
  return <tfoot {...rest} ref={ref} className={cx('hds-table__footer', className)} />;
});

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * 선택된 행 스타일. 선택 상태 자체는 행 안의 Checkbox 로 전달한다
   * (일반 표의 `tr` 에는 `aria-selected` 를 쓸 수 없다).
   */
  selected?: boolean;
}
const Row = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected = false, className, ...rest },
  ref,
) {
  return (
    <tr
      {...rest}
      ref={ref}
      className={cx('hds-table__row', className)}
      data-state={selected ? 'selected' : undefined}
    />
  );
});

/* -------------------------------------------------------------------------------------------------
 * Head
 * -----------------------------------------------------------------------------------------------*/

export interface TableHeadProps extends Omit<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  /** 정렬. @default 'start' */
  align?: TableAlign;
  /** 숫자 열. 끝 정렬 + 고정폭 숫자. @default false */
  numeric?: boolean;
  /**
   * 정렬 가능한 열이면 `onSort` 와 함께 현재 방향을 준다.
   * 정렬 중인 열에만 `aria-sort` 가 붙는다 (WAI-ARIA Sortable Table).
   */
  sortDirection?: TableSortDirection;
  /** 주면 머리 셀 안에 정렬 버튼을 렌더링한다. */
  onSort?: () => void;
}

const SortIcon = ({ direction }: { direction: TableSortDirection }) => (
  <svg className="hds-table__sort-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path
      d="M8 3 11 6.5H5L8 3Z"
      opacity={direction === 'ascending' ? 1 : direction === 'descending' ? 0.25 : 0.45}
    />
    <path
      d="M8 13 5 9.5h6L8 13Z"
      opacity={direction === 'descending' ? 1 : direction === 'ascending' ? 0.25 : 0.45}
    />
  </svg>
);

const Head = React.forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  {
    align = 'start',
    numeric = false,
    sortDirection,
    onSort,
    scope = 'col',
    className,
    children,
    ...rest
  },
  ref,
) {
  const ctx = React.useContext(TableContext);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const previous = React.useRef(sortDirection);
  const sorted = sortDirection === 'ascending' || sortDirection === 'descending';

  React.useEffect(() => {
    const prev = previous.current;
    previous.current = sortDirection;
    if (!ctx || !onSort || prev === sortDirection) return;
    if (sortDirection === 'ascending' || sortDirection === 'descending') {
      const column = buttonRef.current?.textContent?.trim() ?? '';
      ctx.announce(ctx.sortAnnouncement(column, sortDirection));
    }
  }, [sortDirection, onSort, ctx]);

  return (
    <th
      {...rest}
      ref={ref}
      scope={scope}
      className={cx('hds-table__head', className)}
      data-align={numeric ? 'end' : align}
      data-numeric={numeric ? '' : undefined}
      data-sortable={onSort ? '' : undefined}
      aria-sort={sorted ? sortDirection : undefined}
    >
      {onSort ? (
        <button
          ref={buttonRef}
          type="button"
          className="hds-table__sort"
          onClick={onSort}
          data-direction={sortDirection ?? 'none'}
        >
          <span>{children}</span>
          <SortIcon direction={sortDirection ?? 'none'} />
        </button>
      ) : (
        children
      )}
    </th>
  );
});

/* -------------------------------------------------------------------------------------------------
 * Cell
 * -----------------------------------------------------------------------------------------------*/

export interface TableCellProps extends Omit<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  'align'
> {
  /** 정렬. @default 'start' */
  align?: TableAlign;
  /** 숫자 셀. 끝 정렬 + 고정폭 숫자. @default false */
  numeric?: boolean;
}

const Cell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align = 'start', numeric = false, className, ...rest },
  ref,
) {
  return (
    <td
      {...rest}
      ref={ref}
      className={cx('hds-table__cell', className)}
      data-align={numeric ? 'end' : align}
      data-numeric={numeric ? '' : undefined}
    />
  );
});

export { Root, Caption, Header, Body, Footer, Row, Head, Cell };
