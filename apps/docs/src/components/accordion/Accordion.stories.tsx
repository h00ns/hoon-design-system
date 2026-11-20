import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '@hoon-ds/react';

const FAQ = [
  {
    value: 'shipping',
    q: '배송은 얼마나 걸리나요?',
    a: '결제 완료 후 영업일 기준 2~3일 안에 도착합니다. 도서·산간 지역은 1~2일 더 걸릴 수 있습니다.',
  },
  {
    value: 'refund',
    q: '환불은 어떻게 하나요?',
    a: '상품을 받은 날부터 7일 안에 마이페이지 > 주문 내역에서 환불을 신청할 수 있습니다.',
  },
  {
    value: 'gift',
    q: '선물 포장이 되나요?',
    a: '주문서의 "선물 포장" 옵션을 선택하면 무료로 포장해 드립니다.',
  },
];

// Root 의 props 는 type 에 따라 갈리는 유니언이라 Playground 용 args 를 따로 정의한다
interface PlaygroundArgs {
  type: 'single' | 'multiple';
  collapsible: boolean;
}

const meta = {
  title: 'Components/Accordion',
  component: Accordion.Root,
  args: { type: 'single', collapsible: true },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    collapsible: { control: 'boolean', if: { arg: 'type', eq: 'single' } },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 520, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Items = () =>
  FAQ.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Trigger>{item.q}</Accordion.Trigger>
      <Accordion.Content>{item.a}</Accordion.Content>
    </Accordion.Item>
  ));

export const Playground: Story = {
  render: ({ type, collapsible }) =>
    type === 'single' ? (
      <Accordion.Root type="single" collapsible={collapsible}>
        <Items />
      </Accordion.Root>
    ) : (
      <Accordion.Root type="multiple">
        <Items />
      </Accordion.Root>
    ),
};

export const Multiple: Story = {
  name: '여러 개 열기 (multiple)',
  render: () => (
    <Accordion.Root type="multiple" defaultValue={['shipping', 'refund']}>
      <Items />
    </Accordion.Root>
  ),
};

export const NotCollapsible: Story = {
  name: '항상 하나는 열림',
  render: () => (
    <Accordion.Root type="single" defaultValue="shipping">
      <Items />
    </Accordion.Root>
  ),
};

export const DisabledItem: Story = {
  name: '비활성 항목',
  render: () => (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value="a">
        <Accordion.Trigger>주문 내역</Accordion.Trigger>
        <Accordion.Content>최근 3개월의 주문입니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="b" disabled>
        <Accordion.Trigger>정기 구독 (준비 중)</Accordion.Trigger>
        <Accordion.Content>곧 제공됩니다.</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};

export const HeadingLevel: Story = {
  name: '제목 레벨',
  render: () => (
    <section>
      <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>자주 묻는 질문</h2>
      <Accordion.Root type="single" collapsible>
        {FAQ.map((item) => (
          <Accordion.Item key={item.value} value={item.value}>
            {/* 섹션 제목이 h2 이므로 아코디언 제목은 h3 (기본값) */}
            <Accordion.Trigger headingLevel={3}>{item.q}</Accordion.Trigger>
            <Accordion.Content>{item.a}</Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  ),
};
