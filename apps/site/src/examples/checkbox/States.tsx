import { Checkbox } from '@hoon-ds/react';

export default function StatesExample() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox>선택 안 됨</Checkbox>
      <Checkbox defaultChecked>선택됨</Checkbox>
      <Checkbox checked="indeterminate">일부 선택</Checkbox>
      <Checkbox disabled>비활성</Checkbox>
      <Checkbox disabled defaultChecked>
        비활성 · 선택됨
      </Checkbox>
    </div>
  );
}
