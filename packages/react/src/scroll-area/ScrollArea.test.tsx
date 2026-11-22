import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { ScrollArea } from './ScrollArea';

const items = Array.from({ length: 30 }, (_, i) => `태그 ${i + 1}`);

function List(props: React.ComponentProps<typeof ScrollArea>) {
  return (
    <ScrollArea style={{ height: 120 }} {...props}>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ScrollArea>
  );
}

/** jsdom 은 레이아웃을 계산하지 않으므로 뷰포트 크기를 흉내 낸다 */
function mockOverflow(overflowing: boolean) {
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (
    this: HTMLElement,
  ) {
    return this.classList.contains('hds-scroll-area__viewport') && overflowing ? 600 : 100;
  });
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => 100);
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(() => 100);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => 100);
}

describe('ScrollArea', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('내용을 그대로 렌더링한다', () => {
    render(<List />);
    expect(screen.getByText('태그 1')).toBeInTheDocument();
    expect(screen.getByText('태그 30')).toBeInTheDocument();
  });

  it('내용이 넘치면 뷰포트가 탭 순서에 들어가 키보드로 스크롤할 수 있다', async () => {
    mockOverflow(true);
    const user = userEvent.setup();
    render(<List aria-label="태그 목록" />);
    const viewport = screen.getByRole('region', { name: '태그 목록' });
    await waitFor(() => expect(viewport).toHaveAttribute('tabindex', '0'));
    await user.tab();
    expect(viewport).toHaveFocus();
  });

  it('넘치지 않으면 탭 순서에 넣지 않는다', () => {
    mockOverflow(false);
    render(<List aria-label="태그 목록" />);
    expect(screen.getByRole('region', { name: '태그 목록' })).not.toHaveAttribute('tabindex');
  });

  it('이름이 없으면 region 역할을 붙이지 않는다', () => {
    render(<List />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('aria-labelledby 로 보이는 제목을 이름으로 쓸 수 있다', () => {
    render(
      <>
        <h2 id="tags-title">인기 태그</h2>
        <List aria-labelledby="tags-title" />
      </>,
    );
    expect(screen.getByRole('region', { name: '인기 태그' })).toBeInTheDocument();
  });

  it('orientation 을 data 속성으로 노출하고, className 은 루트에, viewportRef 는 뷰포트에 붙는다', () => {
    const viewportRef = React.createRef<HTMLDivElement>();
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <List ref={ref} viewportRef={viewportRef} orientation="both" className="custom" />,
    );
    const root = container.querySelector('.hds-scroll-area');
    expect(root).toBe(ref.current);
    expect(root).toHaveClass('custom');
    expect(root).toHaveAttribute('data-orientation', 'both');
    expect(viewportRef.current).toHaveClass('hds-scroll-area__viewport');
  });

  it('접근성 위반 없음', async () => {
    mockOverflow(true);
    const { container } = render(
      <main>
        <List aria-label="태그 목록" />
      </main>,
    );
    await waitFor(() =>
      expect(screen.getByRole('region', { name: '태그 목록' })).toHaveAttribute('tabindex', '0'),
    );
    await expectNoA11yViolations(container);
  });
});
