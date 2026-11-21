import { Button, Dialog } from '@hoon-ds/react';

const SIZES = ['sm', 'md', 'lg', 'full'] as const;

export default function SizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger asChild>
            <Button variant="secondary">{size}</Button>
          </Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Header>
              <Dialog.Title>size=&quot;{size}&quot;</Dialog.Title>
              <Dialog.Description>
                640px 미만 화면에서는 하단 시트로, full 은 전체 화면으로 바뀝니다.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>창 너비를 줄여서 확인해 보세요.</Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button>확인</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </>
  );
}
