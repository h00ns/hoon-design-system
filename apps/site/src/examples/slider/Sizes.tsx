import { Slider } from '@hoon-ds/react';

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 320 }}>
      <Slider aria-label="작은 슬라이더" size="sm" defaultValue={[30]} />
      <Slider aria-label="보통 슬라이더" size="md" defaultValue={[60]} />
    </div>
  );
}
