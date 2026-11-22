import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from '../button/Button';
import * as Collapsible from './Collapsible';

function Example(props: React.ComponentProps<typeof Collapsible.Root>) {
  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger>상세 정보</Collapsible.Trigger>
      <Collapsible.Content>
        <p>배송은 2~3일 걸립니다.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

const trigger = () => screen.getByRole('button', { name: '상세 정보' });

describe('Collapsible', () => {
  it('처음에는 접혀 있고 aria-expanded="false"', () => {
    render(<Example />);
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('배송은 2~3일 걸립니다.')).not.toBeInTheDocument();
  });

  it.each([['{Enter}'], [' ']])('키보드(%s)로 펼치고 접는다', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard(key);
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('배송은 2~3일 걸립니다.')).toBeVisible();
    await user.keyboard(key);
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('트리거가 aria-controls 로 내용 영역을 가리킨다', async () => {
    render(<Example defaultOpen />);
    const content = document.querySelector('.hds-collapsible__content');
    expect(trigger()).toHaveAttribute('aria-controls', content?.id);
  });

  it('제어 모드로 쓸 수 있다', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Example open={false} onOpenChange={onOpenChange} />);
    await userEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    rerender(<Example open onOpenChange={onOpenChange} />);
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('disabled 면 열리지 않는다', async () => {
    render(<Example disabled />);
    await userEvent.click(trigger());
    expect(trigger()).toBeDisabled();
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('asChild 로 Button 을 트리거로 쓸 수 있고, 이때는 기본 트리거 스타일을 붙이지 않는다', async () => {
    render(
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <Button variant="secondary">더 보기</Button>
        </Collapsible.Trigger>
        <Collapsible.Content>숨은 내용</Collapsible.Content>
      </Collapsible.Root>,
    );
    const button = screen.getByRole('button', { name: '더 보기' });
    expect(button).toHaveClass('hds-button');
    expect(button).not.toHaveClass('hds-collapsible__trigger');
    await userEvent.click(button);
    expect(screen.getByText('숨은 내용')).toBeVisible();
  });

  it('forceMount 면 닫혀도 DOM 에 남고 data-state="closed" 로 표시된다 (CSS 가 숨김)', () => {
    render(
      <Collapsible.Root>
        <Collapsible.Trigger>열기</Collapsible.Trigger>
        <Collapsible.Content forceMount>검색에 걸려야 하는 내용</Collapsible.Content>
      </Collapsible.Root>,
    );
    const content = document.querySelector('.hds-collapsible__content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveAttribute('data-state', 'closed');
  });

  it('접근성 위반 없음', async () => {
    const { container, rerender } = render(<Example />);
    await expectNoA11yViolations(container);
    rerender(<Example defaultOpen />);
    await expectNoA11yViolations(container);
  });
});
