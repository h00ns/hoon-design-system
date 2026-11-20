import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Field, IconButton, Input, Popover } from '@hoon-ds/react';

const InfoIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 7a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1Zm0-4a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 10 5Z" />
  </svg>
);

const meta = {
  title: 'Components/Popover',
  component: Popover.Content,
  args: {
    side: 'bottom',
    align: 'center',
    arrow: false,
    sideOffset: 8,
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    arrow: { control: 'boolean' },
    sideOffset: { control: { type: 'number', min: 0, max: 24 } },
    container: { control: false },
  },
} satisfies Meta<typeof Popover.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="secondary">배송지 메모</Button>
      </Popover.Trigger>
      <Popover.Content {...args}>
        <div style={{ display: 'grid', gap: 12, width: 260 }}>
          <div>
            <Popover.Title>배송지 메모</Popover.Title>
            <Popover.Description>배송 기사님께 전달됩니다.</Popover.Description>
          </div>
          <Field.Root>
            <Field.Label>메모</Field.Label>
            <Input placeholder="예: 문 앞에 놓아 주세요" />
          </Field.Root>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Popover.Close asChild>
              <Button size="sm" variant="ghost">
                취소
              </Button>
            </Popover.Close>
            <Popover.Close asChild>
              <Button size="sm">저장</Button>
            </Popover.Close>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const WithArrow: Story = {
  name: '화살표',
  args: { arrow: true },
  render: (args) => (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton aria-label="적립금 안내" variant="secondary">
          <InfoIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content {...args}>
        <div style={{ maxWidth: 240 }}>
          <Popover.Title>적립금 안내</Popover.Title>
          <Popover.Description>
            구매 확정 후 7일 뒤에 지급되며 1년간 사용할 수 있습니다.{' '}
            <a href="#points" style={{ color: 'var(--hds-color-accent-fg)' }}>
              자세히 보기
            </a>
          </Popover.Description>
        </div>
      </Popover.Content>
    </Popover.Root>
  ),
};

export const Sides: Story = {
  name: '방향',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover.Root key={side}>
          <Popover.Trigger asChild>
            <Button variant="secondary">{side}</Button>
          </Popover.Trigger>
          <Popover.Content {...args} side={side} arrow aria-label={`${side} 팝오버`}>
            side=&quot;{side}&quot;
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  ),
};

export const WithAnchor: Story = {
  name: 'Anchor',
  render: (args) => (
    <Popover.Root>
      <Popover.Anchor asChild>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 12px',
            border: '1px solid var(--hds-color-border-default)',
            borderRadius: 8,
          }}
        >
          <span>쿠폰 3장 보유</span>
          <Popover.Trigger asChild>
            <Button size="sm" variant="ghost">
              보기
            </Button>
          </Popover.Trigger>
        </div>
      </Popover.Anchor>
      <Popover.Content {...args} align="start" aria-label="보유 쿠폰">
        <ul style={{ margin: 0, paddingInlineStart: 18 }}>
          <li>신규 가입 10% 할인</li>
          <li>무료 배송</li>
          <li>생일 5,000원 할인</li>
        </ul>
      </Popover.Content>
    </Popover.Root>
  ),
};
