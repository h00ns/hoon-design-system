import { Field, Select } from '@hoon-ds/react';

const FRUITS = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'blueberry', label: '블루베리' },
  { value: 'grape', label: '포도' },
  { value: 'orange', label: '오렌지' },
];

export default function BasicExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 280 }}>
      <Field.Label>좋아하는 과일</Field.Label>
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="과일을 선택하세요" />
        </Select.Trigger>
        <Select.Content>
          {FRUITS.map((fruit) => (
            <Select.Item key={fruit.value} value={fruit.value}>
              {fruit.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Field.Root>
  );
}
