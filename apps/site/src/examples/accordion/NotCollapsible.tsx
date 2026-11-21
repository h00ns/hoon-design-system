import { Accordion } from '@hoon-ds/react';

export default function NotCollapsibleExample() {
  return (
    <Accordion.Root type="single" defaultValue="shipping" style={{ width: '100%', maxWidth: 520 }}>
      <Accordion.Item value="shipping">
        <Accordion.Trigger>배송 정보</Accordion.Trigger>
        <Accordion.Content>서울시 강남구 테헤란로 123, 홍길동 010-0000-0000</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="payment">
        <Accordion.Trigger>결제 수단</Accordion.Trigger>
        <Accordion.Content>신용카드 (끝자리 1234)</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="coupon">
        <Accordion.Trigger>쿠폰</Accordion.Trigger>
        <Accordion.Content>사용 가능한 쿠폰이 2장 있습니다.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
