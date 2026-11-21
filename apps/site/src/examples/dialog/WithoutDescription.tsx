import { Button, Dialog, Input } from '@hoon-ds/react';

export default function WithoutDescriptionExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">공유</Button>
      </Dialog.Trigger>
      {/* 설명이 없으면 aria-describedby={undefined} 로 명시한다 */}
      <Dialog.Content size="sm" aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>링크 공유</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Input aria-label="공유 링크" readOnly defaultValue="https://example.com/s/abc123" />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button>완료</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
