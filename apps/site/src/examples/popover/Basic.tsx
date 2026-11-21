import { Button, Field, Input, Popover } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">배송지 메모</Button>
      </Popover.Trigger>
      <Popover.Content>
        <div style={{ display: 'grid', gap: 12, width: 260 }}>
          <div>
            <Popover.Title>배송지 메모</Popover.Title>
            <Popover.Description>배송 기사님께 전달됩니다.</Popover.Description>
          </div>
          <Field.Root>
            <Field.Label>메모</Field.Label>
            <Input placeholder="예: 문 앞에 놓아 주세요" />
          </Field.Root>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Popover.Close asChild>
              <Button size="sm" variant="ghost">
                취소
              </Button>
            </Popover.Close>
            <Popover.Close asChild>
              <Button size="sm">저장</Button>
            </Popover.Close>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
