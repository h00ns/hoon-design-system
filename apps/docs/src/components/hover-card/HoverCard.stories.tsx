import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, HoverCard } from '@hoon-ds/react';

const meta = {
  title: 'Components/HoverCard',
  component: HoverCard.Root,
  args: { openDelay: 500, closeDelay: 300 },
  argTypes: {
    openDelay: { control: { type: 'number', step: 100 } },
    closeDelay: { control: { type: 'number', step: 100 } },
  },
} satisfies Meta<typeof HoverCard.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <p style={{ margin: 0 }}>
      작성자:{' '}
      <HoverCard.Root {...args}>
        <HoverCard.Trigger href="#users/hong">@홍길동</HoverCard.Trigger>
        <HoverCard.Content>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name="홍길동" alt="" />
            <div>
              <strong>홍길동</strong>
              <p style={{ margin: 0 }}>프런트엔드 개발자. 팔로워 1,284명</p>
            </div>
          </div>
        </HoverCard.Content>
      </HoverCard.Root>
    </p>
  ),
};

export const WithArrow: Story = {
  render: (args) => (
    <HoverCard.Root {...args}>
      <HoverCard.Trigger href="#docs/tokens">디자인 토큰</HoverCard.Trigger>
      <HoverCard.Content arrow side="top">
        색·간격·글꼴 같은 디자인 결정을 이름 붙여 저장한 값입니다.
      </HoverCard.Content>
    </HoverCard.Root>
  ),
};
