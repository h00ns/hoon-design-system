import { Progress } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <Progress value={42} label="파일 업로드" showValue />
    </div>
  );
}
