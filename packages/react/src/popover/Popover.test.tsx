import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from '../button/Button';
import * as Popover from './Popover';
import type { PopoverContentProps } from './Popover';

function Example({
  contentProps,
  rootProps,
}: {
  contentProps?: Partial<PopoverContentProps>;
  rootProps?: React.ComponentProps<typeof Popover.Root>;
}) {
  return (
    <>
      <Popover.Root {...rootProps}>
        <Popover.Trigger asChild>
          <Button variant="secondary">필터</Button>
        </Popover.Trigger>
        <Popover.Content {...contentProps}>
          <Popover.Title>필터</Popover.Title>
          <Popover.Description>목록에 적용할 조건을 고르세요.</Popover.Description>
          <label>
            <input type="checkbox" /> 품절 제외
          </label>
          <Popover.Close asChild>
            <Button size="sm">적용</Button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Root>
      <button type="button">다음 버튼</button>
    </>
  );
}

const trigger = () => screen.getByRole('button', { name: '필터' });

describe('Popover', () => {
  it('트리거가 열림 상태와 연결 정보를 노출한다', async () => {
    render(<Example />);
    expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger());
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    expect(trigger()).toHaveAttribute('aria-controls', screen.getByRole('dialog').id);
  });

  it.each([['{Enter}'], [' ']])('키보드(%s)로 열리고 포커스가 내용으로 이동한다', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard(key);
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement);
  });

  it('Title·Description 이 이름·설명으로 연결된다', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    expect(screen.getByRole('dialog', { name: '필터' })).toHaveAccessibleDescription(
      '목록에 적용할 조건을 고르세요.',
    );
  });

  it('Esc 로 닫히고 포커스가 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('바깥을 누르면 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('Popover.Close 로 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: '적용' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('비모달: 바깥 콘텐츠를 보조기기에서 숨기지 않는다', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    expect(screen.getByRole('button', { name: '다음 버튼' })).toBeInTheDocument();
    expect(document.body).not.toHaveAttribute('data-scroll-locked');
  });

  it('arrow 를 켜면 화살표를 그린다 (기본 꺼짐)', async () => {
    const { unmount } = render(<Example />);
    await userEvent.click(trigger());
    expect(document.querySelector('.hds-popover__arrow')).toBeNull();
    unmount();
    render(<Example contentProps={{ arrow: true }} />);
    await userEvent.click(trigger());
    expect(document.querySelector('.hds-popover__arrow')).not.toBeNull();
  });

  it('제어 모드를 지원한다', async () => {
    const onOpenChange = vi.fn();
    render(<Example rootProps={{ open: true, onOpenChange }} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('className 을 병합하고 ref 를 전달한다', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>열기</Popover.Trigger>
        <Popover.Content ref={ref} className="x" aria-label="내용">
          내용
        </Popover.Content>
      </Popover.Root>,
    );
    expect(ref.current).toHaveClass('hds-popover', 'x');
  });

  it('접근성 위반 없음', async () => {
    render(<Example contentProps={{ arrow: true }} />);
    await userEvent.click(trigger());
    await expectNoA11yViolations(document.body);
  });
});
