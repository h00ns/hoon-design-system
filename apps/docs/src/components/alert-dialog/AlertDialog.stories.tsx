import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertDialog, Button } from '@hoon-ds/react';
import { useState } from 'react';

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialog.Content,
  argTypes: {
    container: { control: false },
  },
} satisfies Meta<typeof AlertDialog.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">계정 삭제</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content {...args}>
        <AlertDialog.Title>계정을 삭제할까요?</AlertDialog.Title>
        <AlertDialog.Description>
          주문 내역과 적립금이 모두 사라지며 복구할 수 없습니다.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>취소</AlertDialog.Cancel>
          <AlertDialog.Action variant="danger">삭제</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};

export const Confirm: Story = {
  name: '일반 확인',
  render: (args) => (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="secondary">작성 취소</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content {...args}>
        <AlertDialog.Title>작성을 그만둘까요?</AlertDialog.Title>
        <AlertDialog.Description>지금까지 입력한 내용은 저장되지 않습니다.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>계속 작성</AlertDialog.Cancel>
          <AlertDialog.Action>그만두기</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
};

export const Async: Story = {
  name: '비동기 동작',
  render: function AsyncStory(args) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState('');
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <AlertDialog.Root open={open} onOpenChange={(next) => !pending && setOpen(next)}>
          <AlertDialog.Trigger asChild>
            <Button variant="danger">게시글 삭제</Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content {...args}>
            <AlertDialog.Title>게시글을 삭제할까요?</AlertDialog.Title>
            <AlertDialog.Description>삭제하면 댓글도 함께 사라집니다.</AlertDialog.Description>
            <AlertDialog.Footer>
              <AlertDialog.Cancel disabled={pending}>취소</AlertDialog.Cancel>
              <AlertDialog.Action
                variant="danger"
                loading={pending}
                onClick={(event) => {
                  // 요청이 끝날 때까지 열어 둔다
                  event.preventDefault();
                  setPending(true);
                  setTimeout(() => {
                    setPending(false);
                    setOpen(false);
                    setResult('게시글을 삭제했습니다.');
                  }, 1500);
                }}
              >
                삭제
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
        {/* 결과는 live region 으로 알린다 */}
        <p role="status" style={{ margin: 0, color: 'var(--hds-color-fg-muted)' }}>
          {result}
        </p>
      </div>
    );
  },
};
