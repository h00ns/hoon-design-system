import { Field, ToggleGroup } from '@hoon-ds/react';

export default function WithFieldExample() {
  return (
    <Field.Root>
      <Field.Label>보기 방식</Field.Label>
      <ToggleGroup.Root type="single" defaultValue="list">
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        <ToggleGroup.Item value="board" disabled>
          보드
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <Field.Description>보드 보기는 준비 중입니다.</Field.Description>
    </Field.Root>
  );
}
