import { Button, Dialog, VisuallyHidden } from '@hoon-ds/react';

export default function HiddenTitleExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">이미지 크게 보기</Button>
      </Dialog.Trigger>
      <Dialog.Content size="lg" aria-describedby={undefined}>
        {/* 화면에 제목이 없어도 스크린리더용 이름은 반드시 둔다 */}
        <VisuallyHidden asChild>
          <Dialog.Title>상품 이미지</Dialog.Title>
        </VisuallyHidden>
        <Dialog.Body>
          <div
            role="img"
            aria-label="상품 사진 자리"
            style={{
              aspectRatio: '16 / 9',
              borderRadius: 8,
              background: 'var(--hds-color-bg-muted)',
            }}
          />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
}
