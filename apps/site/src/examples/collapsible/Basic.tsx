import { Collapsible } from '@hoon-ds/react';

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BasicExample() {
  return (
    <Collapsible.Root style={{ width: '100%', maxWidth: 360 }}>
      <p style={{ margin: 0 }}>주문 3건이 배송 중입니다.</p>
      <Collapsible.Trigger>
        상세 보기
        <ChevronIcon />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <ul style={{ margin: 0 }}>
          <li>무선 키보드: 오늘 도착 예정</li>
          <li>모니터 받침대: 내일 도착 예정</li>
          <li>USB 허브: 출고 준비 중</li>
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
