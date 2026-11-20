import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '@hoon-ds/react';

const CloseIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  >
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="10" cy="10" r="2.5" />
    <path
      d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4"
      strokeLinecap="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
  </svg>
);

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: { 'aria-label': '닫기', children: <CloseIcon /> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    children: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton aria-label="설정" variant="primary">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="설정" variant="secondary">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="설정" variant="ghost">
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="삭제" variant="danger">
        <TrashIcon />
      </IconButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton aria-label="닫기" size="sm" variant="secondary">
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="닫기" size="md" variant="secondary">
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="닫기" size="lg" variant="secondary">
        <CloseIcon />
      </IconButton>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton aria-label="설정" variant="secondary" disabled>
        <SettingsIcon />
      </IconButton>
      <IconButton aria-label="설정" variant="secondary" loading>
        <SettingsIcon />
      </IconButton>
    </div>
  ),
};
