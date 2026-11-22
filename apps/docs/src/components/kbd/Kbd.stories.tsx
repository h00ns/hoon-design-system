import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from '@hoon-ds/react';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  args: { children: 'Esc', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Combinations: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <span>
        검색 <Kbd keys={['⌘', 'K']} />
      </span>
      <span>
        복사 <Kbd keys={['Ctrl', 'C']} separator="+" />
      </span>
      <span>
        다음 항목 <Kbd>↓</Kbd>
      </span>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Kbd size="sm">Tab</Kbd>
      <Kbd size="md">Tab</Kbd>
    </div>
  ),
};
