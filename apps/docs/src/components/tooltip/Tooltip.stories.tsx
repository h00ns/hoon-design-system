import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, IconButton, SimpleTooltip, Tooltip } from '@hoon-ds/react';

const GearIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M11.1 2.2a1 1 0 0 0-2.2 0l-.2 1.3a6.6 6.6 0 0 0-1.6.9l-1.2-.5a1 1 0 0 0-1.2.4l-1.1 1.9a1 1 0 0 0 .3 1.3l1 .8a6.7 6.7 0 0 0 0 1.9l-1 .8a1 1 0 0 0-.3 1.3l1.1 1.9a1 1 0 0 0 1.2.4l1.2-.5c.5.4 1 .7 1.6.9l.2 1.3a1 1 0 0 0 2.2 0l.2-1.3c.6-.2 1.1-.5 1.6-.9l1.2.5a1 1 0 0 0 1.2-.4l1.1-1.9a1 1 0 0 0-.3-1.3l-1-.8a6.7 6.7 0 0 0 0-1.9l1-.8a1 1 0 0 0 .3-1.3l-1.1-1.9a1 1 0 0 0-1.2-.4l-1.2.5a6.6 6.6 0 0 0-1.6-.9l-.2-1.3ZM10 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M8 2a1 1 0 0 0-1 1v1H4a1 1 0 0 0 0 2h12a1 1 0 1 0 0-2h-3V3a1 1 0 0 0-1-1H8Zm-3 6h10l-.7 8.1A2 2 0 0 1 12.3 18H7.7a2 2 0 0 1-2-1.9L5 8Z" />
  </svg>
);

const meta = {
  title: 'Components/Tooltip',
  component: SimpleTooltip,
  args: {
    content: '설정',
    side: 'top',
    align: 'center',
    arrow: true,
    delayDuration: 300,
    children: <span />,
  },
  argTypes: {
    content: { control: 'text' },
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    arrow: { control: 'boolean' },
    delayDuration: { control: { type: 'number', min: 0, max: 1500, step: 100 } },
    children: { control: false },
    contentProps: { control: false },
  },
} satisfies Meta<typeof SimpleTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <SimpleTooltip {...args}>
      <IconButton aria-label="설정" variant="secondary">
        <GearIcon />
      </IconButton>
    </SimpleTooltip>
  ),
};

export const IconToolbar: Story = {
  name: '아이콘 툴바',
  render: () => (
    // Provider 로 감싸면 툴팁 사이를 옮겨 다닐 때 지연 없이 바로 열린다
    <Tooltip.Provider>
      <div role="toolbar" aria-label="게시글 도구" style={{ display: 'flex', gap: 4 }}>
        <SimpleTooltip content="설정">
          <IconButton aria-label="설정">
            <GearIcon />
          </IconButton>
        </SimpleTooltip>
        <SimpleTooltip content="삭제">
          <IconButton aria-label="삭제">
            <TrashIcon />
          </IconButton>
        </SimpleTooltip>
      </div>
    </Tooltip.Provider>
  ),
};

export const Sides: Story = {
  name: '방향',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, padding: 32 }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <SimpleTooltip key={side} {...args} side={side} content={`side="${side}"`}>
          <Button variant="secondary">{side}</Button>
        </SimpleTooltip>
      ))}
    </div>
  ),
};

export const Shortcut: Story = {
  name: '단축키 안내',
  render: () => (
    <SimpleTooltip content="저장 (⌘S)">
      <Button>저장</Button>
    </SimpleTooltip>
  ),
};

export const DisabledButton: Story = {
  name: '비활성 버튼의 이유',
  render: () => (
    <SimpleTooltip content="관리자만 삭제할 수 있습니다">
      {/* 네이티브 disabled 는 이벤트를 받지 못하므로 focusableWhenDisabled 를 쓴다 */}
      <Button variant="critical" disabled focusableWhenDisabled>
        삭제
      </Button>
    </SimpleTooltip>
  ),
};

export const Composition: Story = {
  name: '조립형 API',
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button variant="secondary">조립형</Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" arrow={false}>
        Root · Trigger · Content 를 직접 조합한다
      </Tooltip.Content>
    </Tooltip.Root>
  ),
};

export const AlwaysOpen: Story = {
  name: '열린 상태 (미리보기)',
  render: (args) => (
    <div style={{ paddingTop: 40 }}>
      <SimpleTooltip {...args} open content="항상 열린 예시">
        <Button variant="secondary">미리보기</Button>
      </SimpleTooltip>
    </div>
  ),
};
