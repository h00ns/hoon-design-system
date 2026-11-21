import { Separator } from '@hoon-ds/react';

export default function SemanticExample() {
  return (
    <div style={{ width: '100%', maxWidth: 320, display: 'grid', gap: 12 }}>
      <p style={{ margin: 0 }}>1부 — 설치</p>
      {/* 스크린리더가 "구분선"으로 알린다 */}
      <Separator decorative={false} />
      <p style={{ margin: 0 }}>2부 — 사용법</p>
    </div>
  );
}
