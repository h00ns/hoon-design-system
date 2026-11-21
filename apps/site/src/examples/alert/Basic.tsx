import { Alert } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Alert title="정기 점검 안내">
        11월 22일 02:00–04:00 동안 일부 기능을 사용할 수 없습니다.
      </Alert>
    </div>
  );
}
