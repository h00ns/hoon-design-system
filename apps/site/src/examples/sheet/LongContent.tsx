import { Button, Sheet } from '@hoon-ds/react';

const NOTICES = Array.from({ length: 24 }, (_, i) => i + 1);

export default function LongContentExample() {
  return (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button variant="secondary">알림 내역</Button>
      </Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>알림 내역</Sheet.Title>
          <Sheet.Description>최근 30일 동안 받은 알림입니다.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          {NOTICES.map((n) => (
            <p key={n} style={{ margin: '0 0 12px' }}>
              {n}번째 알림. 주문하신 상품의 배송 상태가 바뀌었습니다.
            </p>
          ))}
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button>모두 읽음</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  );
}
