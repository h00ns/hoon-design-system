import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import * as HoverCard from './HoverCard';
import type { HoverCardRootProps } from './HoverCard';

function Example(props: HoverCardRootProps) {
  return (
    <main>
      <HoverCard.Root {...props}>
        <HoverCard.Trigger href="/users/hoon">@hoon</HoverCard.Trigger>
        <HoverCard.Content>
          <p>프런트엔드 개발자. 디자인 시스템을 만든다.</p>
        </HoverCard.Content>
      </HoverCard.Root>
      <button type="button">다른 버튼</button>
    </main>
  );
}

const link = () => screen.getByRole('link', { name: '@hoon' });
const card = () => screen.queryByText('프런트엔드 개발자. 디자인 시스템을 만든다.');

describe('HoverCard', () => {
  describe('지연', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('포인터를 올리면 기본 500ms 뒤에 열린다', () => {
      render(<Example />);
      fireEvent.pointerEnter(link(), { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(400));
      expect(card()).not.toBeInTheDocument();
      act(() => vi.advanceTimersByTime(150));
      expect(card()).toBeInTheDocument();
    });

    it('포인터가 벗어나면 기본 300ms 뒤에 닫힌다', () => {
      render(<Example defaultOpen />);
      expect(card()).toBeInTheDocument();
      fireEvent.pointerLeave(link(), { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(200));
      expect(card()).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(200));
      expect(card()).not.toBeInTheDocument();
    });

    it('openDelay·closeDelay 를 바꿀 수 있다', () => {
      render(<Example openDelay={0} />);
      fireEvent.pointerEnter(link(), { pointerType: 'mouse' });
      act(() => vi.advanceTimersByTime(1));
      expect(card()).toBeInTheDocument();
    });

    it('터치 포인터로는 열리지 않는다', () => {
      render(<Example openDelay={0} />);
      fireEvent.pointerEnter(link(), { pointerType: 'touch' });
      act(() => vi.advanceTimersByTime(1000));
      expect(card()).not.toBeInTheDocument();
    });
  });

  it('트리거는 실제 링크다', () => {
    render(<Example />);
    expect(link()).toHaveAttribute('href', '/users/hoon');
  });

  it('키보드 포커스로 열리고 포커스가 빠지면 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example openDelay={0} closeDelay={0} />);
    await user.tab();
    expect(link()).toHaveFocus();
    expect(
      await screen.findByText('프런트엔드 개발자. 디자인 시스템을 만든다.'),
    ).toBeInTheDocument();
    await user.tab();
    await vi.waitFor(() => expect(card()).not.toBeInTheDocument());
  });

  it('Esc 로 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example defaultOpen />);
    link().focus();
    await user.keyboard('{Escape}');
    await vi.waitFor(() => expect(card()).not.toBeInTheDocument());
  });

  it('arrow 를 주면 화살표를 그린다', () => {
    render(
      <HoverCard.Root defaultOpen>
        <HoverCard.Trigger href="#">링크</HoverCard.Trigger>
        <HoverCard.Content arrow>내용</HoverCard.Content>
      </HoverCard.Root>,
    );
    expect(document.querySelector('.hds-hover-card__arrow')).not.toBeNull();
  });

  it('접근성 위반 없음 (열린 상태)', async () => {
    render(<Example defaultOpen />);
    expect(card()).toBeInTheDocument();
    await expectNoA11yViolations(document.querySelector('main') as HTMLElement);
    await expectNoA11yViolations(document.querySelector('.hds-hover-card') as HTMLElement);
  });
});
