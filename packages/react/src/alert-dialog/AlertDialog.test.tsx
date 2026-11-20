import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../test/axe';
import { Button } from '../button/Button';
import * as AlertDialog from './AlertDialog';
import type { AlertDialogActionProps } from './AlertDialog';

function Example({
  onAction,
  actionProps,
  rootProps,
}: {
  onAction?: AlertDialogActionProps['onClick'];
  actionProps?: Partial<AlertDialogActionProps>;
  rootProps?: React.ComponentProps<typeof AlertDialog.Root>;
}) {
  return (
    <AlertDialog.Root {...rootProps}>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">계정 삭제</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>계정을 삭제할까요?</AlertDialog.Title>
        <AlertDialog.Description>삭제한 계정은 복구할 수 없습니다.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>취소</AlertDialog.Cancel>
          <AlertDialog.Action variant="danger" onClick={onAction} {...actionProps}>
            삭제
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

const trigger = () => screen.getByRole('button', { name: '계정 삭제' });

describe('AlertDialog', () => {
  it('alertdialog 역할과 이름·설명을 가진다', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    const dialog = screen.getByRole('alertdialog', { name: '계정을 삭제할까요?' });
    expect(dialog).toHaveAccessibleDescription('삭제한 계정은 복구할 수 없습니다.');
  });

  it('키보드로 열리면 가장 안전한 Cancel 에 포커스가 간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: '취소' })).toHaveFocus();
  });

  it('Tab 포커스가 Cancel 과 Action 사이에서만 순환한다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.tab();
    expect(screen.getByRole('button', { name: '삭제' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: '취소' })).toHaveFocus();
  });

  it('Esc 로 닫히고 포커스가 트리거로 돌아간다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const button = trigger();
    await user.click(button);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(() => expect(button).toHaveFocus());
  });

  it('바깥을 눌러도 닫히지 않는다', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    await user.click(document.querySelector('.hds-dialog__overlay') as Element);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('Cancel 은 onClick 없이 닫는다', async () => {
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: '취소' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onAction).not.toHaveBeenCalled();
  });

  it('Action 은 onClick 을 호출하고 닫는다', async () => {
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('Action 의 onClick 에서 preventDefault 하면 열린 채로 남는다 (비동기 작업)', async () => {
    render(<Example onAction={(event) => event.preventDefault()} />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('loading 중인 Action 은 실행되지도, 닫히지도 않는다', async () => {
    const onAction = vi.fn();
    render(
      <Example
        onAction={onAction}
        actionProps={{ loading: true }}
        rootProps={{ defaultOpen: true }}
      />,
    );
    const action = screen.getByRole('button', { name: '삭제' });
    expect(action).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(action);
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('Cancel·Action 의 기본 variant 는 secondary·primary', async () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content>
          <AlertDialog.Title>제목</AlertDialog.Title>
          <AlertDialog.Description>설명</AlertDialog.Description>
          <AlertDialog.Cancel>취소</AlertDialog.Cancel>
          <AlertDialog.Action>확인</AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Root>,
    );
    expect(screen.getByRole('button', { name: '취소' })).toHaveAttribute(
      'data-variant',
      'secondary',
    );
    expect(screen.getByRole('button', { name: '확인' })).toHaveAttribute('data-variant', 'primary');
  });

  it('제어 모드를 지원한다', async () => {
    const onOpenChange = vi.fn();
    render(<Example rootProps={{ open: true, onOpenChange }} />);
    await userEvent.click(screen.getByRole('button', { name: '취소' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('접근성 위반 없음', async () => {
    render(<Example />);
    await userEvent.click(trigger());
    await expectNoA11yViolations(document.body);
  });
});
