import { Button, Sheet } from '@hoon-ds/react';

const SIDES = [
  { side: 'right', label: '오른쪽' },
  { side: 'left', label: '왼쪽' },
  { side: 'top', label: '위' },
  { side: 'bottom', label: '아래' },
] as const;

export default function SidesExample() {
  return (
    <>
      {SIDES.map(({ side, label }) => (
        <Sheet.Root key={side}>
          <Sheet.Trigger asChild>
            <Button variant="secondary">{label}</Button>
          </Sheet.Trigger>
          <Sheet.Content side={side} aria-describedby={undefined}>
            <Sheet.Header>
              <Sheet.Title>{label}에서 나오는 시트</Sheet.Title>
            </Sheet.Header>
            <Sheet.Body>
              <p style={{ margin: 0 }}>side=&quot;{side}&quot;</p>
            </Sheet.Body>
          </Sheet.Content>
        </Sheet.Root>
      ))}
    </>
  );
}
