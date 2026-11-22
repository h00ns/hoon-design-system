import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Checkbox, Field, Input, Sheet } from '@hoon-ds/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Sheet',
  component: Sheet.Content,
  args: {
    side: 'right',
    size: 'md',
    hideCloseButton: false,
    closeLabel: '닫기',
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['right', 'left', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] },
    hideCloseButton: { control: 'boolean' },
    closeLabel: { control: 'text' },
    container: { control: false },
  },
} satisfies Meta<typeof Sheet.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button>필터</Button>
      </Sheet.Trigger>
      <Sheet.Content {...args}>
        <Sheet.Header>
          <Sheet.Title>필터</Sheet.Title>
          <Sheet.Description>조건을 고른 뒤 적용을 누르세요.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          <div style={{ display: 'grid', gap: 16 }}>
            <Field.Root>
              <Field.Label>검색어</Field.Label>
              <Input placeholder="상품명" />
            </Field.Root>
            <Checkbox defaultChecked>무료 배송만</Checkbox>
            <Checkbox>오늘 출발</Checkbox>
          </div>
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button variant="secondary">취소</Button>
          </Sheet.Close>
          <Sheet.Close asChild>
            <Button>적용</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['right', 'left', 'top', 'bottom'] as const).map((side) => (
        <Sheet.Root key={side}>
          <Sheet.Trigger asChild>
            <Button variant="secondary">{side}</Button>
          </Sheet.Trigger>
          <Sheet.Content {...args} side={side} aria-describedby={undefined}>
            <Sheet.Header>
              <Sheet.Title>side=&quot;{side}&quot;</Sheet.Title>
            </Sheet.Header>
            <Sheet.Body>화면 가장자리에서 나오는 패널입니다.</Sheet.Body>
          </Sheet.Content>
        </Sheet.Root>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  render: (args) => (
    <Sheet.Root>
      <Sheet.Trigger asChild>
        <Button variant="secondary">약관 보기</Button>
      </Sheet.Trigger>
      <Sheet.Content {...args}>
        <Sheet.Header>
          <Sheet.Title>이용 약관</Sheet.Title>
          <Sheet.Description>본문만 스크롤되고 머리·바닥은 고정됩니다.</Sheet.Description>
        </Sheet.Header>
        <Sheet.Body>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>
              제{i + 1}조. 본 약관은 서비스 이용과 관련하여 회사와 이용자의 권리와 의무를 정합니다.
            </p>
          ))}
        </Sheet.Body>
        <Sheet.Footer>
          <Sheet.Close asChild>
            <Button>동의</Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet.Root>
  ),
};

export const NonModal: Story = {
  render: function NonModalStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <Sheet.Root open={open} onOpenChange={setOpen} modal={false}>
          <Sheet.Trigger asChild>
            <Button variant="secondary">{open ? '도움말 닫기' : '도움말 열기'}</Button>
          </Sheet.Trigger>
          <Sheet.Content
            {...args}
            size="sm"
            aria-describedby={undefined}
            onInteractOutside={(event) => event.preventDefault()}
          >
            <Sheet.Header>
              <Sheet.Title>도움말</Sheet.Title>
            </Sheet.Header>
            <Sheet.Body>시트를 연 채로 페이지의 다른 요소를 계속 쓸 수 있습니다.</Sheet.Body>
          </Sheet.Content>
        </Sheet.Root>
        <Input aria-label="페이지 입력" placeholder="시트를 연 채로 입력해 보세요" />
      </div>
    );
  },
};
