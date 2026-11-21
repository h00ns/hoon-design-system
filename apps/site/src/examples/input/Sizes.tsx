import { Input } from '@hoon-ds/react';

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      <Input size="sm" aria-label="작게" placeholder="sm (32px)" />
      <Input size="md" aria-label="보통" placeholder="md (40px)" />
      <Input size="lg" aria-label="크게" placeholder="lg (48px)" />
    </div>
  );
}
