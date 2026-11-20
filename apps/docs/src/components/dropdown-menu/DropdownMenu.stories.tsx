import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, DropdownMenu, IconButton } from '@hoon-ds/react';
import { useState } from 'react';

const icon = (d: string) => () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EditIcon = icon('M10.5 2.5 13.5 5.5 5.5 13.5H2.5V10.5Z');
const CopyIcon = icon('M5.5 5.5h8v8h-8zM10.5 5.5v-3h-8v8h3');
const ShareIcon = icon('M8 2v8M5 5l3-3 3 3M3 9v4.5h10V9');
const TrashIcon = icon('M2.5 4.5h11M6 4.5V2.5h4v2M4 4.5l.7 9h6.6l.7-9');
const MoreIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <circle cx="3.5" cy="8" r="1.25" />
    <circle cx="8" cy="8" r="1.25" />
    <circle cx="12.5" cy="8" r="1.25" />
  </svg>
);

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu.Content,
  args: { side: 'bottom', align: 'start' },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'right', 'bottom', 'left'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DropdownMenu.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">옵션</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...args}>
        <DropdownMenu.Item aria-keyshortcuts="Meta+E">
          <EditIcon />
          편집
          <DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item aria-keyshortcuts="Meta+D">
          <CopyIcon />
          복제
          <DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <ShareIcon />
          공유 (권한 없음)
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger">
          <TrashIcon />
          삭제
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

export const IconTrigger: Story = {
  name: '아이콘 버튼 트리거',
  render: (args) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton aria-label="더보기">
          <MoreIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...args} align="end">
        <DropdownMenu.Item>이름 바꾸기</DropdownMenu.Item>
        <DropdownMenu.Item>이동</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger">삭제</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

export const CheckboxAndRadio: Story = {
  name: '체크 · 라디오 항목',
  render: function CheckboxAndRadioStory(args) {
    const [showGrid, setShowGrid] = useState(true);
    const [showRuler, setShowRuler] = useState(false);
    const [sort, setSort] = useState('recent');
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">보기</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content {...args}>
          <DropdownMenu.Group aria-labelledby="menu-display-label">
            <DropdownMenu.Label id="menu-display-label">표시</DropdownMenu.Label>
            <DropdownMenu.CheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
              격자
            </DropdownMenu.CheckboxItem>
            <DropdownMenu.CheckboxItem checked={showRuler} onCheckedChange={setShowRuler}>
              눈금자
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Label id="menu-sort-label">정렬</DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            aria-labelledby="menu-sort-label"
            value={sort}
            onValueChange={setSort}
          >
            <DropdownMenu.RadioItem value="recent">최근 수정순</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="name">이름순</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="size">크기순</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
};

export const Submenu: Story = {
  name: '하위 메뉴',
  render: (args) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">파일</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...args}>
        <DropdownMenu.Item>새 문서</DropdownMenu.Item>
        <DropdownMenu.Item>열기…</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>내보내기</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>PDF</DropdownMenu.Item>
            <DropdownMenu.Item>Word (.docx)</DropdownMenu.Item>
            <DropdownMenu.Item>Markdown</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>인쇄</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

export const Inset: Story = {
  name: '아이콘 정렬 (inset)',
  render: (args) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">편집</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content {...args}>
        <DropdownMenu.Item>
          <CopyIcon />
          복사
        </DropdownMenu.Item>
        <DropdownMenu.Item inset>붙여넣기</DropdownMenu.Item>
        <DropdownMenu.Item inset>서식 없이 붙여넣기</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};
