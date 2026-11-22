import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@hoon-ds/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { count: 20, defaultPage: 1, siblingCount: 1, boundaryCount: 1, size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [page, setPage] = useState(6);
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <p style={{ margin: 0 }}>현재 {page}페이지</p>
        <Pagination count={20} page={page} onPageChange={setPage} />
      </div>
    );
  },
};

export const AsLinks: Story = {
  render: () => <Pagination count={8} page={3} getHref={(p) => `#page-${p}`} />,
};

export const Small: Story = {
  render: () => <Pagination count={12} defaultPage={4} size="sm" />,
};
