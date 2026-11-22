import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScrollArea } from '@hoon-ds/react';

const TAGS = Array.from({ length: 40 }, (_, i) => `태그 ${i + 1}`);

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  args: { orientation: 'vertical', type: 'hover', 'aria-label': '태그 목록' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal', 'both'] },
    type: { control: 'inline-radio', options: ['hover', 'scroll', 'auto', 'always'] },
    viewportRef: { control: false },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = {
  border: '1px solid var(--hds-color-border-default)',
  borderRadius: 8,
} as const;

export const Playground: Story = {
  render: (args) => (
    <ScrollArea {...args} style={{ ...frame, width: 240, height: 200 }}>
      <ul style={{ margin: 0, padding: '8px 16px' }}>
        {TAGS.map((tag) => (
          <li key={tag} style={{ padding: '4px 0' }}>
            {tag}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      type="auto"
      aria-label="최근 본 상품"
      style={{ ...frame, width: 360 }}
    >
      <div style={{ display: 'flex', gap: 12, padding: 12, width: 'max-content' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 96,
              height: 96,
              borderRadius: 8,
              background: 'var(--hds-color-bg-muted)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            상품 {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea
      orientation="both"
      type="always"
      aria-label="큰 표"
      style={{ ...frame, width: 320, height: 200 }}
    >
      <div style={{ width: 720, padding: 16, lineHeight: 2 }}>
        {TAGS.map((tag) => (
          <span key={tag} style={{ marginInlineEnd: 24 }}>
            {tag}
          </span>
        ))}
      </div>
    </ScrollArea>
  ),
};
