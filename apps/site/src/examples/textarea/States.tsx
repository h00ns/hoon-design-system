import { Textarea } from '@hoon-ds/react';

export default function StatesExample() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 400 }}>
      <Textarea aria-label="오류" invalid defaultValue="잘못된 값" />
      <Textarea aria-label="읽기 전용" readOnly defaultValue="읽기 전용 내용" />
      <Textarea aria-label="비활성" disabled placeholder="비활성" />
    </div>
  );
}
