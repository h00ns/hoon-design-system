import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '@hoon-ds/react';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  args: { label: '불러오는 중', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

export const InRegion: Story = {
  name: '영역 로딩',
  render: (args) => (
    <section
      aria-busy="true"
      aria-labelledby="orders-title"
      style={{ display: 'grid', gap: 12, justifyItems: 'center', minWidth: 240 }}
    >
      <h3 id="orders-title" style={{ margin: 0, fontSize: 16 }}>
        주문 내역
      </h3>
      <Spinner {...args} label="주문 내역을 불러오는 중" />
    </section>
  ),
};
