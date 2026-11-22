import { ToggleGroup } from '@hoon-ds/react';

export default function SizesExample() {
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ToggleGroup.Root key={size} type="single" size={size} aria-label={`정렬 (${size})`}>
          <ToggleGroup.Item value="left">왼쪽</ToggleGroup.Item>
          <ToggleGroup.Item value="center">가운데</ToggleGroup.Item>
          <ToggleGroup.Item value="right">오른쪽</ToggleGroup.Item>
        </ToggleGroup.Root>
      ))}
    </div>
  );
}
