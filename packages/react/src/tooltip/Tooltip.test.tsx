import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from '../button/Button';
import { IconButton } from '../icon-button/IconButton';
import * as Tooltip from './tooltip-parts';
import { SimpleTooltip } from './Tooltip';

const Icon = () => <svg viewBox="0 0 16 16" />;

function Example(props: Partial<React.ComponentProps<typeof SimpleTooltip>>) {
  return (
    <>
      <SimpleTooltip content="설정 열기" delayDuration={0} {...props}>
        <IconButton aria-label="설정">
          <Icon />
        </IconButton>
      </SimpleTooltip>
      <button type="button">다른 버튼</button>
    </>
  );
}

const trigger = () => screen.getByRole('button', { name: '설정' });

afterEach(() => {
  vi.useRealTimers();
});

describe('Tooltip', () => {
  it('키보드 포커스로 열리고 트리거의 설명으로 연결된다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('설정 열기');
    expect(trigger()).toHaveAccessibleDescription('설정 열기');
  });

  it('포커스가 떠나면 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole('tooltip');
    await user.tab();
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('Esc 로 닫히고 포커스는 트리거에 남는다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
  });

  it('마우스를 올리면 열린다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.hover(trigger());
    expect(await screen.findByRole('tooltip')).toHaveTextContent('설정 열기');
  });

  it('기본 지연(300ms) 후에 열린다', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<Example delayDuration={undefined} />);
    await user.hover(trigger());
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(350);
    });
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  });

  it('클릭(포인터 누름)으로 포커스될 때는 열지 않는다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.pointer({ keys: '[MouseLeft]', target: trigger() });
    // 클릭 직후에는 열리지 않거나 닫힌다 (클릭으로 툴팁이 가리는 것을 막는다)
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('Provider 없이도, Provider 안에서도 동작한다', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button>저장</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Ctrl+S</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Ctrl+S');
  });

  it('제어 모드를 지원한다', () => {
    render(<Example open />);
    expect(screen.getByRole('tooltip')).toHaveTextContent('설정 열기');
  });

  it('arrow 는 기본으로 그리고 끌 수 있다', () => {
    const { unmount } = render(<Example open />);
    expect(document.querySelector('.hds-tooltip__arrow')).not.toBeNull();
    unmount();
    render(<Example open arrow={false} />);
    expect(document.querySelector('.hds-tooltip__arrow')).toBeNull();
  });

  it('focusableWhenDisabled 버튼에서도 열린다', async () => {
    const user = userEvent.setup();
    render(
      <SimpleTooltip content="권한이 없습니다" delayDuration={0}>
        <Button disabled focusableWhenDisabled>
          삭제
        </Button>
      </SimpleTooltip>,
    );
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('권한이 없습니다');
    expect(screen.getByRole('button', { name: '삭제' })).toHaveAccessibleDescription(
      '권한이 없습니다',
    );
  });

  it('접근성 위반 없음', async () => {
    const { container } = render(<Example open />);
    // 포털로 body 에 붙는 툴팁은 랜드마크 밖이라 페이지 수준 규칙(region)에 걸리므로 영역별로 검사한다
    await expectNoA11yViolations(container);
    await expectNoA11yViolations(document.querySelector('.hds-tooltip') as Element);
  });

  it('포커스로 열린 직후 스크롤이 일어나도 닫히지 않는다 (Tab 이동 시 브라우저 자동 스크롤)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip.Root>
        <Tooltip.Trigger>설정</Tooltip.Trigger>
        <Tooltip.Content>설정 열기</Tooltip.Content>
      </Tooltip.Root>,
    );
    await user.tab();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      document.dispatchEvent(new Event('scroll', { bubbles: true }));
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
