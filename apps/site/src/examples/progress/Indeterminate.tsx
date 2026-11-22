import { Progress } from '@hoon-ds/react';

export default function IndeterminateExample() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Progress value={null} label="서버에 연결하는 중" />
    </div>
  );
}
