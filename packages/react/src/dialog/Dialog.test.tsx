import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from '../button/Button';
import * as Dialog from './Dialog';
import type { DialogContentProps } from './Dialog';

function Example({
  contentProps,
  rootProps,
  description = true,
}: {
  contentProps?: Partial<DialogContentProps>;
  rootProps?: React.ComponentProps<typeof Dialog.Root>;
  description?: boolean;
}) {
  return (
    <>
      <Dialog.Root {...rootProps}>
        <Dialog.Trigger asChild>
          <Button>프로필 편집</Button>
        </Dialog.Trigger>
        <Dialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          {...contentProps}
        >
          <Dialog.Header>
            <Dialog.Title>프로필 편집</Dialog.Title>
            {description && <Dialog.Description>변경 내용은 바로 저장됩니다.</Dialog.Description>}
          </Dialog.Header>
          <Dialog.Body>
            <label>
              이름 <input defaultValue="훈" />
            </label>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button variant="secondary">취소</Button>
            </Dialog.Close>
            <Button>저장</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
      <button type="button">바깥 버튼</button>
    </>
  );
}

const trigger = () => screen.getByRole('button', { name: '프로필 편집' });

describe('Dialog', () => {
  it('트리거는 다이얼로그를 연다는 정보를 노출한다', () => {
    render(<Example />);
    expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it.each([['{Enter}'], [' ']])('키보드(%s)로 열린다', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    const button = trigger();
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard(key);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    // 열려 있는 동안 트리거는 aria-hidden 처리되므로 미리 잡아 둔 참조로 확인한다
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('제목과 설명이 접근 가능한 이름·설명으로 연결된다', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    const dialog = screen.getByRole('dialog', { name: '프로필 편집' });
    expect(dialog).toHaveAccessibleDescription('변경 내용은 바로 저장됩니다.');
  });

  it('열리면 포커스가 다이얼로그 안 첫 요소로 이동한다', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    expect(screen.getByRole('textbox', { name: '이름' })).toHaveFocus();
  });

  it('Tab 포커스가 다이얼로그 안에 갇힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    const dialog = screen.getByRole('dialog');
    for (let i = 0; i < 6; i += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('Esc 로 닫히고 포커스가 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('닫기 버튼(기본 이름 "닫기")으로 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: '닫기' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('closeLabel 로 닫기 버튼 이름을 바꾸고, hideCloseButton 으로 숨긴다', async () => {
    const { unmount } = render(<Example contentProps={{ closeLabel: 'Close' }} />);
    await userEvent.click(trigger());
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    unmount();

    render(<Example contentProps={{ hideCloseButton: true }} />);
    await userEvent.click(trigger());
    expect(screen.queryByRole('button', { name: '닫기' })).not.toBeInTheDocument();
  });

  it('Dialog.Close 로 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('오버레이(바깥)를 누르면 닫힌다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    const overlay = document.querySelector('.hds-dialog__overlay');
    expect(overlay).not.toBeNull();
    await user.click(overlay as Element);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('열려 있는 동안 페이지 스크롤을 잠그고 바깥 콘텐츠를 보조기기에서 숨긴다', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    expect(document.body).toHaveAttribute('data-scroll-locked');
    expect(screen.queryByRole('button', { name: '바깥 버튼' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '바깥 버튼', hidden: true })).toBeInTheDocument();
  });

  it('제어 모드(open/onOpenChange)를 지원한다', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <span data-testid="state">{open ? 'open' : 'closed'}</span>
          <Example rootProps={{ open, onOpenChange: setOpen }} />
        </>
      );
    }
    render(<Controlled />);
    await user.click(trigger());
    expect(screen.getByTestId('state')).toHaveTextContent('open');
    await user.keyboard('{Escape}');
    expect(screen.getByTestId('state')).toHaveTextContent('closed');
  });

  it('onOpenChange 를 무시하면 열린 채로 남는다 (예: 저장 전 닫기 방지)', async () => {
    const onOpenChange = vi.fn();
    render(<Example rootProps={{ open: true, onOpenChange }} />);
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('size 를 data 속성으로 노출한다 (기본 md)', async () => {
    const { unmount } = render(<Example />);
    await userEvent.click(trigger());
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'md');
    unmount();
    render(<Example contentProps={{ size: 'lg' }} />);
    await userEvent.click(trigger());
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'lg');
  });

  it('설명 없이 aria-describedby={undefined} 를 넘기면 경고 없이 설명을 생략한다', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Example description={false} />);
    await userEvent.click(trigger());
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  describe('Body', () => {
    it('넘치지 않으면 탭 순서에 끼어들지 않는다', async () => {
      render(<Example />);
      await userEvent.click(trigger());
      expect(document.querySelector('.hds-dialog__body')).not.toHaveAttribute('tabindex');
    });

    it('내용이 넘치면 키보드 스크롤을 위해 포커스 가능해진다', async () => {
      const scrollHeight = vi
        .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
        .mockImplementation(function (this: HTMLElement) {
          return this.classList.contains('hds-dialog__body') ? 1000 : 0;
        });
      const clientHeight = vi
        .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
        .mockImplementation(function (this: HTMLElement) {
          return this.classList.contains('hds-dialog__body') ? 200 : 0;
        });
      render(<Example />);
      await userEvent.click(trigger());
      expect(document.querySelector('.hds-dialog__body')).toHaveAttribute('tabindex', '0');
      scrollHeight.mockRestore();
      clientHeight.mockRestore();
    });

    it('ref 를 전달한다', async () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Content aria-describedby={undefined}>
            <Dialog.Title>제목</Dialog.Title>
            <Dialog.Body ref={ref}>내용</Dialog.Body>
          </Dialog.Content>
        </Dialog.Root>,
      );
      expect(ref.current).toHaveClass('hds-dialog__body');
    });
  });

  it('접근성 위반 없음', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    await expectNoA11yViolations(document.body);
  });
});
