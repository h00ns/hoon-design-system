import { Button, Collapsible, Field, Input } from '@hoon-ds/react';

export default function WithButtonExample() {
  return (
    <Collapsible.Root style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      <Field.Root>
        <Field.Label>서버 주소</Field.Label>
        <Input defaultValue="https://api.example.com" />
      </Field.Root>
      <Collapsible.Trigger asChild>
        <Button variant="secondary" size="sm" style={{ justifySelf: 'start' }}>
          고급 설정
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Field.Root>
          <Field.Label>요청 제한 시간(초)</Field.Label>
          <Input type="number" defaultValue={30} />
          <Field.Description>대부분은 바꿀 필요가 없습니다.</Field.Description>
        </Field.Root>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
