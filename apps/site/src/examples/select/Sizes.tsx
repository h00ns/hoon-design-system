import { Field, Select } from '@hoon-ds/react';

const SIZES = ['sm', 'md', 'lg'] as const;

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 280 }}>
      {SIZES.map((size) => (
        <Field.Root key={size}>
          <Field.Label>{size}</Field.Label>
          <Select.Root defaultValue="grape">
            <Select.Trigger size={size}>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="apple">사과</Select.Item>
              <Select.Item value="banana">바나나</Select.Item>
              <Select.Item value="grape">포도</Select.Item>
            </Select.Content>
          </Select.Root>
        </Field.Root>
      ))}
    </div>
  );
}
