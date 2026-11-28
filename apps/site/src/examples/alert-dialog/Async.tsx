import { AlertDialog, Button } from '@hoon-ds/react';
import { useState } from 'react';
import type { MouseEvent } from 'react';

/** 서버 요청을 흉내 낸다 */
const deletePost = () => new Promise((resolve) => setTimeout(resolve, 1500));

export default function AsyncExample() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState('');

  const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    // 요청이 끝날 때까지 열어 둔다
    event.preventDefault();
    setPending(true);
    await deletePost();
    setPending(false);
    setOpen(false);
    setResult('게시글을 삭제했습니다.');
  };

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      {/* 요청 중에는 Esc 등으로 닫히지 않게 한다 */}
      <AlertDialog.Root open={open} onOpenChange={(next) => !pending && setOpen(next)}>
        <AlertDialog.Trigger asChild>
          <Button variant="critical">게시글 삭제</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Title>게시글을 삭제할까요?</AlertDialog.Title>
          <AlertDialog.Description>삭제하면 댓글도 함께 사라집니다.</AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Cancel disabled={pending}>취소</AlertDialog.Cancel>
            <AlertDialog.Action variant="critical" loading={pending} onClick={handleDelete}>
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
}
