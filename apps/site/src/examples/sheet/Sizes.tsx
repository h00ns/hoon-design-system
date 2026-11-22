import { Button, Sheet } from '@hoon-ds/react';

const SIZES = ['sm', 'md', 'lg', 'full'] as const;

export default function SizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Sheet.Root key={size}>
          <Sheet.Trigger asChild>
            <Button variant="secondary">{size}</Button>
          </Sheet.Trigger>
          <Sheet.Content size={size} aria-describedby={undefined}>
            <Sheet.Header>
              <Sheet.Title>size=&quot;{size}&quot;</Sheet.Title>
            </Sheet.Header>
            <Sheet.Body>
              <p style={{ margin: 0 }}>
                좌우 시트는 너비가, 위아래 시트는 최대 높이가 바뀝니다. 작은 화면에서는 바깥을 눌러
                닫을 수 있도록 오버레이가 조금 보이게 남깁니다.
              </p>
            </Sheet.Body>
          </Sheet.Content>
        </Sheet.Root>
      ))}
    </>
  );
}
