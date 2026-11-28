import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, VisuallyHidden } from '@hoon-ds/react';
import type { BadgeTone, BadgeVariant } from '@hoon-ds/react';

const TONES: BadgeTone[] = ['neutral', 'accent', 'success', 'warning', 'critical'];
const VARIANTS: BadgeVariant[] = ['subtle', 'solid'];
const LABELS: Record<BadgeTone, string> = {
  neutral: '임시저장',
  accent: '신규',
  success: '완료',
  warning: '검토 중',
  critical: '반려',
};

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M13.3 4.3a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L6.6 9.6l5.3-5.3a1 1 0 0 1 1.4 0Z" />
  </svg>
);

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: '완료', tone: 'success' },
  argTypes: {
    tone: { control: 'inline-radio', options: TONES },
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {VARIANTS.map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>
              {LABELS[tone]}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Badge {...args}>
      <CheckIcon />
      인증됨
    </Badge>
  ),
};

export const Count: Story = {
  render: () => (
    <button
      type="button"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        font: 'inherit',
        padding: '6px 12px',
        borderRadius: 6,
        border: '1px solid var(--hds-color-border-control)',
        background: 'var(--hds-color-bg-default)',
        color: 'var(--hds-color-fg-default)',
      }}
    >
      알림{' '}
      <Badge tone="critical" variant="solid" size="sm">
        3<VisuallyHidden>개의 새 알림</VisuallyHidden>
      </Badge>
    </button>
  ),
};
