import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as Table from './Table';
import type { TableSortDirection } from './Table';

const ROWS = [
  { name: '사과', price: 3000 },
  { name: '바나나', price: 1500 },
  { name: '체리', price: 8000 },
];

function BasicTable(props: Partial<Table.TableRootProps>) {
  return (
    <Table.Root {...props}>
      <Table.Caption>과일 가격</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>이름</Table.Head>
          <Table.Head numeric>가격</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {ROWS.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell numeric>{r.price.toLocaleString('ko-KR')}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

function SortableTable() {
  const [dir, setDir] = React.useState<TableSortDirection>('none');
  const sorted = [...ROWS].sort((a, b) =>
    dir === 'none' ? 0 : dir === 'ascending' ? a.price - b.price : b.price - a.price,
  );
  return (
    <Table.Root>
      <Table.Caption>과일 가격</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>이름</Table.Head>
          <Table.Head
            numeric
            sortDirection={dir}
            onSort={() => setDir(dir === 'ascending' ? 'descending' : 'ascending')}
          >
            가격
          </Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {sorted.map((r) => (
          <Table.Row key={r.name}>
            <Table.Cell>{r.name}</Table.Cell>
            <Table.Cell numeric>{r.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

describe('Table', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('캡션이 표의 이름이 되고 머리 셀은 scope="col" 이다', () => {
    render(<BasicTable />);
    const table = screen.getByRole('table', { name: '과일 가격' });
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    headers.forEach((th) => expect(th).toHaveAttribute('scope', 'col'));
  });

  it('숫자 열은 끝 정렬 표시를 가진다', () => {
    render(<BasicTable />);
    expect(screen.getByRole('columnheader', { name: '가격' })).toHaveAttribute('data-align', 'end');
    expect(screen.getByRole('cell', { name: '3,000' })).toHaveAttribute('data-numeric');
  });

  it('density·striped·stickyHeader 를 컨테이너 data 속성으로 노출한다', () => {
    const { container } = render(<BasicTable density="compact" striped stickyHeader />);
    const wrapper = container.querySelector('.hds-table')!;
    expect(wrapper).toHaveAttribute('data-density', 'compact');
    expect(wrapper).toHaveAttribute('data-striped');
    expect(wrapper).toHaveAttribute('data-sticky-header');
  });

  it('넘치지 않으면 스크롤 컨테이너는 포커스되지 않는다', () => {
    const { container } = render(<BasicTable />);
    const wrapper = container.querySelector('.hds-table')!;
    expect(wrapper).not.toHaveAttribute('tabindex');
    expect(wrapper).not.toHaveAttribute('role');
  });

  it('넘치면 캡션을 이름으로 가진 포커스 가능한 영역이 된다', async () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1200);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
    const user = userEvent.setup();
    render(<BasicTable />);
    const region = screen.getByRole('region', { name: '과일 가격' });
    expect(region).toHaveAttribute('tabindex', '0');
    await user.tab();
    expect(region).toHaveFocus();
  });

  it('캡션이 없으면 aria-label 로 영역 이름을 준다', () => {
    vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(1200);
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(400);
    render(
      <Table.Root aria-label="주문 목록">
        <Table.Body>
          <Table.Row>
            <Table.Cell>a</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByRole('region', { name: '주문 목록' })).toBeInTheDocument();
  });

  it('Caption visuallyHidden 은 숨김 클래스를 붙인다', () => {
    render(
      <Table.Root>
        <Table.Caption visuallyHidden>숨긴 캡션</Table.Caption>
        <Table.Body>
          <Table.Row>
            <Table.Cell>a</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByText('숨긴 캡션')).toHaveClass('hds-visually-hidden');
    expect(screen.getByRole('table', { name: '숨긴 캡션' })).toBeInTheDocument();
  });

  it('선택된 행은 data-state="selected" 를 가진다', () => {
    render(
      <Table.Root aria-label="t">
        <Table.Body>
          <Table.Row selected>
            <Table.Cell>a</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    expect(screen.getByRole('row')).toHaveAttribute('data-state', 'selected');
  });

  describe('정렬', () => {
    it('정렬 전에는 aria-sort 가 없고, 정렬 버튼이 머리 셀 안에 있다', () => {
      render(<SortableTable />);
      const th = screen.getByRole('columnheader', { name: '가격' });
      expect(th).not.toHaveAttribute('aria-sort');
      expect(within(th).getByRole('button', { name: '가격' })).toBeInTheDocument();
    });

    it('누르면 aria-sort 가 바뀌고 정렬 결과를 알린다', async () => {
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        cb(0);
        return 0;
      });
      const user = userEvent.setup();
      render(<SortableTable />);
      const th = screen.getByRole('columnheader', { name: '가격' });
      const button = within(th).getByRole('button');

      await user.click(button);
      expect(th).toHaveAttribute('aria-sort', 'ascending');
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('가격 열 오름차순 정렬됨'),
      );
      const firstRowCells = within(screen.getAllByRole('row')[1]!).getAllByRole('cell');
      expect(firstRowCells[0]).toHaveTextContent('바나나');

      await user.keyboard('{Enter}');
      expect(th).toHaveAttribute('aria-sort', 'descending');
      await waitFor(() =>
        expect(screen.getByRole('status')).toHaveTextContent('가격 열 내림차순 정렬됨'),
      );
    });

    it('sortAnnouncement 로 알림 문구를 바꿀 수 있다', async () => {
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        cb(0);
        return 0;
      });
      function Custom() {
        const [dir, setDir] = React.useState<TableSortDirection>('none');
        return (
          <Table.Root
            aria-label="t"
            sortAnnouncement={(col, d) => `${col}: ${d === 'ascending' ? '낮은 순' : '높은 순'}`}
          >
            <Table.Header>
              <Table.Row>
                <Table.Head sortDirection={dir} onSort={() => setDir('ascending')}>
                  가격
                </Table.Head>
              </Table.Row>
            </Table.Header>
          </Table.Root>
        );
      }
      const user = userEvent.setup();
      render(<Custom />);
      await user.click(screen.getByRole('button', { name: '가격' }));
      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('가격: 낮은 순'));
    });
  });

  it('접근성 위반 없음 (기본 · 정렬)', async () => {
    const { container, unmount } = render(<BasicTable striped />);
    await expectNoA11yViolations(container);
    unmount();
    const sortable = render(<SortableTable />);
    await act(async () => {
      await expectNoA11yViolations(sortable.container);
    });
  });
});
