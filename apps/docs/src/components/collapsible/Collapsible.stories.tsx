import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Collapsible } from '@hoon-ds/react';

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible.Root,
  args: { defaultOpen: false, disabled: false },
  argTypes: {
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ width: 360 }}>{Story()}</div>],
} satisfies Meta<typeof Collapsible.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Collapsible.Root {...args}>
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
  ),
};

export const WithButton: Story = {
  render: (args) => (
    <Collapsible.Root {...args}>
      <Collapsible.Trigger asChild>
        <Button variant="secondary" size="sm">
          고급 설정
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p style={{ margin: 0 }}>대부분의 사용자는 바꿀 필요가 없는 설정입니다.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  ),
};
