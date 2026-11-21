import { Field, Select } from '@hoon-ds/react';

export default function ItemAlignedExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 280 }}>
      <Field.Label>과일</Field.Label>
      <Select.Root defaultValue="grape">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        {/* 선택된 항목이 트리거 위에 겹치도록 연다 (macOS 네이티브 select 처럼) */}
        <Select.Content position="item-aligned">
          <Select.Item value="apple">사과</Select.Item>
          <Select.Item value="banana">바나나</Select.Item>
          <Select.Item value="blueberry">블루베리</Select.Item>
          <Select.Item value="grape">포도</Select.Item>
          <Select.Item value="orange">오렌지</Select.Item>
        </Select.Content>
      </Select.Root>
    </Field.Root>
  );
}
