import { Accordion } from '@hoon-ds/react';

export default function HeadingLevelExample() {
  return (
    <section aria-labelledby="faq-title" style={{ width: '100%', maxWidth: 520 }}>
      <h2 id="faq-title" style={{ margin: '0 0 8px', fontSize: 20 }}>
        자주 묻는 질문
      </h2>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="shipping">
          {/* 섹션 제목이 h2 이므로 아코디언 제목은 한 단계 아래인 h3 */}
          <Accordion.Trigger headingLevel={3}>배송은 얼마나 걸리나요?</Accordion.Trigger>
          <Accordion.Content>결제 완료 후 영업일 기준 2~3일 안에 도착합니다.</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="refund">
          <Accordion.Trigger headingLevel={3}>환불은 어떻게 하나요?</Accordion.Trigger>
          <Accordion.Content>
            상품을 받은 날부터 7일 안에 마이페이지에서 환불을 신청할 수 있습니다.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </section>
  );
}
