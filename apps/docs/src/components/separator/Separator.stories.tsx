import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Separator } from '@hoon-ds/react';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  args: { orientation: 'horizontal', decorative: true },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 40, display: 'flex', alignItems: 'center' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 12 }}>
      <div>
        <strong>hoon-design-system</strong>
        <p style={{ margin: '4px 0 0', color: 'var(--hds-color-fg-muted)' }}>
          접근성을 기본값으로 갖춘 디자인 시스템
        </p>
      </div>
      <Separator />
      <p style={{ margin: 0 }}>버전 0.0.0</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
      <Button variant="ghost" size="sm">
        굵게
      </Button>
      <Button variant="ghost" size="sm">
        기울임
      </Button>
      <Separator orientation="vertical" />
      <Button variant="ghost" size="sm">
        링크
      </Button>
    </div>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div style={{ width: 320, display: 'grid', gap: 12 }}>
      <p style={{ margin: 0 }}>1부 — 설치</p>
      <Separator decorative={false} />
      <p style={{ margin: 0 }}>2부 — 사용법</p>
    </div>
  ),
};
