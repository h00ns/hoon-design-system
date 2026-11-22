import { Combobox, Field } from '@hoon-ds/react';

const PLANS = [
  { value: 'free', label: '무료' },
  { value: 'pro', label: '프로' },
  { value: 'team', label: '팀 (준비 중)', disabled: true },
  { value: 'enterprise', label: '엔터프라이즈' },
];

export default function DisabledExample() {
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      <Field.Root>
        <Field.Label>요금제</Field.Label>
        <Combobox options={PLANS} placeholder="요금제 검색" />
        <Field.Description>준비 중인 항목은 선택할 수 없습니다.</Field.Description>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>결제 주기</Field.Label>
        <Combobox options={PLANS} defaultValue="pro" />
      </Field.Root>
    </div>
  );
}
