import { Button, Checkbox, Field, Input, Sheet } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button>필터</Button>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>필터</Sheet.Title>
          <Sheet.Description>조건을 고른 뒤 적용을 누르세요.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div style={{ display: 'grid', gap: 16 }}>
            <Field.Root>
              <Field.Label>검색어</Field.Label>
              <Input placeholder="상품명" />
            </Field.Root>
            <Checkbox defaultChecked>무료 배송만</Checkbox>
            <Checkbox>오늘 출발</Checkbox>
          </div>
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="secondary">취소</Button>
          </Sheet.Close>
          <Sheet.Close asChild>
            <Button>적용</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  );
}
