import { Button, Dialog, Field, Input } from '@hoon-ds/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSaved(String(data.get('nickname') ?? ''));
    setOpen(false);
  };

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button>닉네임 변경</Button>
        </Dialog.Trigger>
        <Dialog.Content size="sm">
          <form style={{ display: 'contents' }} onSubmit={handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>닉네임 변경</Dialog.Title>
              <Dialog.Description>저장하면 다이얼로그가 닫힙니다.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root required>
                <Field.Label>닉네임</Field.Label>
                <Input name="nickname" autoComplete="nickname" />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button variant="secondary">취소</Button>
              </Dialog.Close>
              <Button type="submit">저장</Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Root>
      <p role="status" style={{ margin: 0, color: 'var(--hds-color-fg-muted)' }}>
        {saved ? `저장됨: ${saved}` : '아직 저장하지 않았습니다.'}
      </p>
    </div>
  );
}
