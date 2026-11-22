import { Progress } from '@hoon-ds/react';

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 360 }}>
      <Progress value={30} size="sm" label="sm" showValue />
      <Progress value={50} size="md" label="md" showValue />
      <Progress value={70} size="lg" label="lg" showValue />
    </div>
  );
}
