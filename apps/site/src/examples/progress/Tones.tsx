import { Progress } from '@hoon-ds/react';

export default function TonesExample() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 360 }}>
      <Progress value={60} label="업로드 중" showValue />
      {/* 상태는 색만이 아니라 레이블에도 적는다 */}
      <Progress value={100} tone="success" label="업로드 완료" showValue />
      <Progress value={35} tone="critical" label="업로드 실패: 용량 초과" showValue />
    </div>
  );
}
