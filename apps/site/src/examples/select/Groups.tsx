import { Field, Select } from '@hoon-ds/react';

export default function GroupsExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 280 }}>
      <Field.Label>음식</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="음식을 선택하세요" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>과일</Select.Label>
            <Select.Item value="apple">사과</Select.Item>
            <Select.Item value="banana">바나나</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>채소</Select.Label>
            <Select.Item value="carrot">당근</Select.Item>
            <Select.Item value="cabbage">양배추</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Field.Root>
  );
}
