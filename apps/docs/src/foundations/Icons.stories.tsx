import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Icons from '@hoon-ds/icons';
import { SearchIcon, TrashIcon } from '@hoon-ds/icons';
import type { Icon } from '@hoon-ds/icons';
import { ICON_CATEGORIES, ICON_META } from '@hoon-ds/icons/meta';
import { Button, IconButton } from '@hoon-ds/react';

const registry = Icons as unknown as Record<string, Icon>;

const meta = {
  title: 'Foundations/Icons',
  component: SearchIcon,
  args: { size: 32, weight: 'regular' },
  argTypes: {
    weight: { control: 'inline-radio', options: ['regular', 'bold', 'fill'] },
    size: { control: { type: 'range', min: 12, max: 64, step: 4 } },
    title: { control: 'text' },
    mirrored: { control: 'boolean' },
  },
} satisfies Meta<typeof SearchIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** 장식 아이콘은 숨기고, 이름은 버튼에 붙인다. */
export const InButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="secondary">
        <TrashIcon /> 삭제
      </Button>
      <IconButton aria-label="검색" variant="ghost">
        <SearchIcon />
      </IconButton>
    </div>
  ),
};

export const All: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      {Object.entries(ICON_CATEGORIES).map(([category, label]) => (
        <section key={category}>
          <h3 style={{ margin: '0 0 8px', fontSize: 14 }}>{label}</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {ICON_META.filter((m) => m.category === category).map((m) => {
              const Glyph = registry[m.component]!;
              return <Glyph key={m.name} size={args.size} weight={args.weight} title={m.name} />;
            })}
          </div>
        </section>
      ))}
    </div>
  ),
  args: { size: 24 },
};
