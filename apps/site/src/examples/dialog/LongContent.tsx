import { Button, Dialog } from '@hoon-ds/react';

const ARTICLES = Array.from({ length: 20 }, (_, i) => i + 1);

export default function LongContentExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">이용약관 보기</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>이용약관</Dialog.Title>
          <Dialog.Description>최종 수정일 2026년 11월 1일</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          {ARTICLES.map((n) => (
            <p key={n} style={{ margin: '0 0 12px' }}>
              제{n}조. 본 약관은 서비스 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임 사항을
              규정합니다. 내용이 넘치면 머리글과 버튼은 고정되고 이 영역만 스크롤됩니다.
            </p>
          ))}
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">닫기</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button>동의</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
