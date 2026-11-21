import { Accordion } from '@hoon-ds/react';

const FAQ = [
  {
    value: 'shipping',
    question: '배송은 얼마나 걸리나요?',
    answer:
      '결제 완료 후 영업일 기준 2~3일 안에 도착합니다. 도서·산간 지역은 1~2일 더 걸릴 수 있습니다.',
  },
  {
    value: 'refund',
    question: '환불은 어떻게 하나요?',
    answer: '상품을 받은 날부터 7일 안에 마이페이지 > 주문 내역에서 환불을 신청할 수 있습니다.',
  },
  {
    value: 'gift',
    question: '선물 포장이 되나요?',
    answer: '주문서의 "선물 포장" 옵션을 선택하면 무료로 포장해 드립니다.',
  },
];

export default function BasicExample() {
  return (
    <Accordion.Root type="single" collapsible style={{ width: '100%', maxWidth: 520 }}>
      {FAQ.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Trigger>{item.question}</Accordion.Trigger>
          <Accordion.Content>{item.answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
