import { Input } from '@hoon-ds/react';

export default function StatesExample() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      <Input aria-label="기본" placeholder="기본" />
      <Input aria-label="오류" invalid defaultValue="잘못된 값" />
      <Input aria-label="읽기 전용" readOnly defaultValue="읽기 전용" />
      <Input aria-label="비활성" disabled placeholder="비활성" />
    </div>
  );
}
