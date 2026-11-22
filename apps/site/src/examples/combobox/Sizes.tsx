import { Combobox } from '@hoon-ds/react';

const FRUITS = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'grape', label: '포도' },
];

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <Combobox options={FRUITS} size="sm" aria-label="과일 (sm)" placeholder="sm" />
      <Combobox options={FRUITS} size="md" aria-label="과일 (md)" placeholder="md" />
      <Combobox options={FRUITS} size="lg" aria-label="과일 (lg)" placeholder="lg" />
    </div>
  );
}
