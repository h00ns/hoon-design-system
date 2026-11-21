import { Accordion } from '@hoon-ds/react';

export default function DisabledItemExample() {
  return (
    <Accordion.Root type="single" collapsible style={{ width: '100%', maxWidth: 520 }}>
      <Accordion.Item value="orders">
        <Accordion.Trigger>주문 내역</Accordion.Trigger>
        <Accordion.Content>최근 3개월의 주문입니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="subscription" disabled>
        <Accordion.Trigger>정기 구독 (준비 중)</Accordion.Trigger>
        <Accordion.Content>곧 제공됩니다.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
