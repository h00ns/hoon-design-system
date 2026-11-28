import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@hoon-ds/react';
import { useState } from 'react';

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 4a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H5a1 1 0 1 1 0-2h4V5a1 1 0 0 1 1-1Z" />
  </svg>
);

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: '저장' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'critical'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="critical">
        Critical
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args}>
        <PlusIcon />
        추가
      </Button>
      {/* 아이콘만 있는 버튼은 반드시 aria-label 로 이름을 준다 */}
      <Button {...args} variant="secondary" aria-label="추가">
        <PlusIcon />
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args} disabled>
        disabled
      </Button>
      <Button {...args} disabled focusableWhenDisabled>
        focusableWhenDisabled
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  render: function LoadingStory(args) {
    const [loading, setLoading] = useState(false);
    return (
      <Button
        {...args}
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        눌러서 로딩
      </Button>
    );
  },
};

export const AsLink: Story = {
  render: (args) => (
    <Button {...args} asChild variant="secondary">
      <a href="#docs">문서 보기</a>
    </Button>
  ),
};
