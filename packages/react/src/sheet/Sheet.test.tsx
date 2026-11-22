import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from '../button/Button';
import * as Sheet from './Sheet';
import type { SheetContentProps } from './Sheet';

function Example({
  contentProps,
  rootProps,
  description = true,
}: {
  contentProps?: Partial<SheetContentProps>;
  rootProps?: React.ComponentProps<typeof Sheet.Root>;
  description?: boolean;
}) {
  return (
    <>
      <Sheet.Root {...rootProps}>
        <Sheet.Trigger asChild>
          <Button>필터</Button>
        </Sheet.Trigger>
        <Sheet.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          {...contentProps}
        >
          <Sheet.Header>
            <Sheet.Title>필터</Sheet.Title>
            {description && <Sheet.Description>조건을 고르면 목록이 바뀝니다.</Sheet.Description>}
          </Sheet.Header>
          <Sheet.Body>
            <label>
              검색어 <input defaultValue="" />
            </label>
          </Sheet.Body>
          <Sheet.Footer>
            <Sheet.Close asChild>
              <Button variant="secondary">취소</Button>
            </Sheet.Close>
            <Button>적용</Button>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
      <button type="button">바깥 버튼</button>
    </>
  );
}

const trigger = () => screen.getByRole('button', { name: '필터' });

describe('Sheet', () => {
  it('트리거는 다이얼로그를 연다는 정보를 노출한다', () => {
    render(<Example />);
    expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it.each([['{Enter}'], [' ']])('키보드(%s)로 열린다', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard(key);
    expect(await screen.findByRole('dialog', { name: '필터' })).toBeInTheDocument();
  });

  it('제목과 설명이 dialog 의 이름·설명으로 연결된다', async () => {
    render(<Example rootProps={{ defaultOpen: true }} />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAccessibleName('필터');
    expect(dialog).toHaveAccessibleDescription('조건을 고르면 목록이 바뀝니다.');
  });

  it('열리면 첫 번째 입력으로 포커스가 가고, 닫히면 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
  });

  it('모달이면 Tab 이 시트 안에서만 순환한다', async () => {
    const user = userEvent.setup();
    render(<Example rootProps={{ defaultOpen: true }} />);
    const dialog = await screen.findByRole('dialog');
    for (let i = 0; i < 6; i += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('기본 닫기 버튼은 "닫기" 라는 이름을 가지고 시트를 닫는다', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example rootProps={{ defaultOpen: true, onOpenChange }} />);
    await user.click(await screen.findByRole('button', { name: '닫기' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closeLabel·hideCloseButton 으로 닫기 버튼을 바꾸거나 숨긴다', async () => {
    const { rerender } = render(
      <Example rootProps={{ defaultOpen: true }} contentProps={{ closeLabel: 'Close' }} />,
    );
    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument();
    rerender(
      <Example rootProps={{ defaultOpen: true }} contentProps={{ hideCloseButton: true }} />,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('side·size 를 data 속성으로 노출한다 (기본 right·md)', async () => {
    const { rerender } = render(<Example rootProps={{ defaultOpen: true }} />);
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('data-side', 'right');
    expect(dialog).toHaveAttribute('data-size', 'md');
    rerender(
      <Example rootProps={{ defaultOpen: true }} contentProps={{ side: 'bottom', size: 'lg' }} />,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'bottom');
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'lg');
  });

  it('모달이면 오버레이를 그리고, 비모달이면 그리지 않는다', async () => {
    const { rerender } = render(<Example rootProps={{ defaultOpen: true }} />);
    await screen.findByRole('dialog');
    expect(document.querySelector('.hds-sheet__overlay')).not.toBeNull();
    expect(screen.getByRole('dialog')).toHaveAttribute('data-modal');

    rerender(<Example rootProps={{ defaultOpen: true, modal: false }} />);
    await waitFor(() => expect(document.querySelector('.hds-sheet__overlay')).toBeNull());
    expect(screen.getByRole('dialog')).not.toHaveAttribute('data-modal');
  });

  it('모달이면 바깥 콘텐츠를 보조기기에서 숨기고, 비모달이면 그대로 둔다', async () => {
    const { rerender } = render(<Example rootProps={{ defaultOpen: true }} />);
    await screen.findByRole('dialog');
    expect(screen.queryByRole('button', { name: '바깥 버튼' })).not.toBeInTheDocument();

    rerender(<Example rootProps={{ defaultOpen: true, modal: false }} />);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '바깥 버튼' })).toBeInTheDocument(),
    );
  });

  it('비모달이면 바깥 요소를 클릭해 포커스할 수 있다', async () => {
    const user = userEvent.setup();
    render(
      <Example
        rootProps={{ defaultOpen: true, modal: false }}
        // 바깥을 눌러도 닫히지 않게 하는 흔한 패턴 (필터 패널 등)
        contentProps={{ onInteractOutside: (event) => event.preventDefault() }}
      />,
    );
    await screen.findByRole('dialog');
    const outside = screen.getByRole('button', { name: '바깥 버튼' });
    await user.click(outside);
    expect(outside).toHaveFocus();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('Body 는 내용이 넘치지 않으면 포커스되지 않는다', async () => {
    render(<Example rootProps={{ defaultOpen: true }} />);
    await screen.findByRole('dialog');
    expect(document.querySelector('.hds-sheet__body')).not.toHaveAttribute('tabindex');
  });

  it('설명이 없어도 경고 없이 열린다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Example rootProps={{ defaultOpen: true }} description={false} />);
    await screen.findByRole('dialog');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('접근성 위반 없음 (열린 상태)', async () => {
    render(<Example rootProps={{ defaultOpen: true }} />);
    await screen.findByRole('dialog');
    await expectNoA11yViolations(document.body);
  });
});
