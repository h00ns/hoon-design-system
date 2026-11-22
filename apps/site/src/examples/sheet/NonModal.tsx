import { Button, Input, Sheet } from '@hoon-ds/react';
import { useState } from 'react';

export default function NonModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <Sheet.Root open={open} onOpenChange={setOpen} modal={false}>
        <Sheet.Trigger asChild>
          <Button variant="secondary">{open ? '도움말 닫기' : '도움말 열기'}</Button>
        </Sheet.Trigger>
        <Sheet.Content
          size="sm"
          aria-describedby={undefined}
          // 페이지를 쓰는 동안 시트가 닫히지 않도록 바깥 클릭을 무시한다
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Sheet.Header>
            <Sheet.Title>도움말</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <p style={{ margin: 0 }}>시트를 연 채로 페이지의 입력창을 계속 쓸 수 있습니다.</p>
          </Sheet.Body>
        </Sheet.Content>
      </Sheet.Root>
      <Input aria-label="메모" placeholder="시트를 연 채로 입력해 보세요" />
    </div>
  );
}
