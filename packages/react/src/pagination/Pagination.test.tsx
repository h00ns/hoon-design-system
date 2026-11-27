import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Pagination, paginationRange } from './Pagination';

describe('paginationRange', () => {
  it.each([
    [{ page: 1, count: 1 }, [1]],
    [{ page: 2, count: 3 }, [1, 2, 3]],
    [{ page: 1, count: 7 }, [1, 2, 3, 4, 5, 6, 7]],
    [{ page: 1, count: 20 }, [1, 2, 3, 4, 5, 'ellipsis-end', 20]],
    [{ page: 6, count: 20 }, [1, 'ellipsis-start', 5, 6, 7, 'ellipsis-end', 20]],
    [{ page: 20, count: 20 }, [1, 'ellipsis-start', 16, 17, 18, 19, 20]],
    [
      { page: 10, count: 20, siblingCount: 2, boundaryCount: 2 },
      [1, 2, 'ellipsis-start', 8, 9, 10, 11, 12, 'ellipsis-end', 19, 20],
    ],
    [{ page: 1, count: 0 }, []],
  ])('%o → %o', (input, expected) => {
    expect(paginationRange(input)).toEqual(expected);
  });

  it('현재 페이지가 어디든 항목 수가 일정하다 (버튼 위치가 흔들리지 않는다)', () => {
    const lengths = new Set(
      Array.from({ length: 20 }, (_, i) => paginationRange({ page: i + 1, count: 20 }).length),
    );
    expect([...lengths]).toEqual([7]);
  });
});

describe('Pagination', () => {
  it('"페이지 이동" 내비게이션이며 현재 페이지에 aria-current 가 있다', () => {
    render(<Pagination count={10} defaultPage={3} />);
    const nav = screen.getByRole('navigation', { name: '페이지 이동' });
    expect(within(nav).getByRole('button', { name: '3 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('button', { name: '1 페이지' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('생략 기호는 보조기기에서 숨긴다', () => {
    const { container } = render(<Pagination count={20} defaultPage={10} />);
    const ellipses = container.querySelectorAll('.hds-pagination__ellipsis');
    expect(ellipses).toHaveLength(2);
    ellipses.forEach((e) => expect(e).toHaveAttribute('aria-hidden', 'true'));
  });

  it('비제어: 버튼을 누르면 페이지가 바뀌고 onPageChange 가 불린다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: '다음' }));
    expect(onPageChange).toHaveBeenLastCalledWith(2);
    expect(screen.getByRole('button', { name: '2 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await user.click(screen.getByRole('button', { name: '5 페이지' }));
    expect(onPageChange).toHaveBeenLastCalledWith(5);
  });

  it('첫 페이지에서 이전, 마지막 페이지에서 다음은 비활성이다', () => {
    const { rerender } = render(<Pagination count={5} page={1} />);
    expect(screen.getByRole('button', { name: '이전' })).toBeDisabled();
    rerender(<Pagination count={5} page={5} />);
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('제어 모드: page prop 을 따르고 직접 바꾸지 않는다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={5} page={2} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: '3 페이지' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: '2 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('현재 페이지를 다시 누르면 onPageChange 가 불리지 않는다', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination count={5} defaultPage={2} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: '2 페이지' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('페이지가 바뀌어도 누른 버튼의 포커스가 유지된다', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [page, setPage] = React.useState(1);
      return <Pagination count={20} page={page} onPageChange={setPage} />;
    }
    render(<Controlled />);
    const next = screen.getByRole('button', { name: '다음' });
    next.focus();
    await user.keyboard('{Enter}{Enter}{Enter}');
    expect(screen.getByRole('button', { name: '4 페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('button', { name: '다음' })).toHaveFocus();
  });

  it('getHref 를 주면 링크로 렌더링하고, 비활성 이전 링크는 href 가 없다', () => {
    render(<Pagination count={3} page={1} getHref={(p) => `?page=${p}`} />);
    expect(screen.getByRole('link', { name: '2 페이지' })).toHaveAttribute('href', '?page=2');
    expect(screen.getByRole('link', { name: '1 페이지' })).toHaveAttribute('aria-current', 'page');
    const prev = screen.getByRole('link', { name: '이전' });
    expect(prev).not.toHaveAttribute('href');
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('linkAs 로 라우터 링크 컴포넌트를 쓸 수 있다', () => {
    const RouterLink = React.forwardRef<HTMLAnchorElement, React.ComponentProps<'a'>>(
      function RouterLink({ children, ...props }, ref) {
        return (
          <a {...props} ref={ref} data-router="">
            {children}
          </a>
        );
      },
    );
    render(<Pagination count={3} page={1} getHref={(p) => `/list/${p}`} linkAs={RouterLink} />);
    expect(screen.getByRole('link', { name: '2 페이지' })).toHaveAttribute('data-router');
  });

  it('labels 와 aria-label 을 바꿀 수 있다', () => {
    render(
      <Pagination
        count={3}
        aria-label="검색 결과 페이지"
        labels={{ previous: 'Prev', next: 'Next', page: (p) => `Page ${p}` }}
      />,
    );
    expect(screen.getByRole('navigation', { name: '검색 결과 페이지' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
  });

  it('접근성 위반 없음 (버튼 · 링크)', async () => {
    const { container } = render(
      <div>
        <Pagination count={20} defaultPage={8} />
        <Pagination count={20} page={1} getHref={(p) => `?p=${p}`} aria-label="링크 페이지 이동" />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
