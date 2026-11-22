import { Field, Select } from '@hoon-ds/react';

export default function DisabledExample() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 280 }}>
      {/* 항목 하나만 비활성: 키보드 이동에서 건너뛴다 */}
      <Field.Root>
        <Field.Label>요금제</Field.Label>
        <Select.Root>
          <Select.Trigger>
            <Select.Value placeholder="요금제를 선택하세요" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="free">무료</Select.Item>
            <Select.Item value="pro">프로</Select.Item>
            <Select.Item value="enterprise" disabled>
              엔터프라이즈 (문의)
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Field.Root>

      {/* Select 전체 비활성: Field 의 disabled 를 이어받는다 */}
      <Field.Root disabled>
        <Field.Label>현재 요금제</Field.Label>
        <Select.Root defaultValue="pro">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="pro">프로</Select.Item>
          </Select.Content>
        </Select.Root>
      </Field.Root>
    </div>
  );
}
