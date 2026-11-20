import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog, Field, Input, VisuallyHidden } from '@hoon-ds/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Dialog',
  component: Dialog.Content,
  args: {
    size: 'md',
    hideCloseButton: false,
    closeLabel: '닫기',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] },
    hideCloseButton: { control: 'boolean' },
    closeLabel: { control: 'text' },
    container: { control: false },
  },
} satisfies Meta<typeof Dialog.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>프로필 편집</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Header>
          <Dialog.Title>프로필 편집</Dialog.Title>
          <Dialog.Description>변경한 내용은 저장을 눌러야 반영됩니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <div style={{ display: 'grid', gap: 16 }}>
            <Field.Root required>
              <Field.Label>이름</Field.Label>
              <Input defaultValue="홍길동" autoComplete="name" />
            </Field.Root>
            <Field.Root>
              <Field.Label>소개</Field.Label>
              <Input placeholder="한 줄 소개" />
              <Field.Description>프로필 상단에 보입니다.</Field.Description>
            </Field.Root>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">취소</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button>저장</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {(['sm', 'md', 'lg', 'full'] as const).map((size) => (
        <Dialog.Root key={size}>
          <Dialog.Trigger asChild>
            <Button variant="secondary">{size}</Button>
          </Dialog.Trigger>
          <Dialog.Content {...args} size={size}>
            <Dialog.Header>
              <Dialog.Title>size=&quot;{size}&quot;</Dialog.Title>
              <Dialog.Description>
                640px 미만 화면에서는 하단 시트로, full 은 전체 화면으로 바뀝니다.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>창 너비를 줄여서 확인해 보세요.</Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close asChild>
                <Button>확인</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  name: '긴 내용 (Body 스크롤)',
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">이용약관 보기</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args}>
        <Dialog.Header>
          <Dialog.Title>이용약관</Dialog.Title>
          <Dialog.Description>최종 수정일 2026년 11월 1일</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ margin: '0 0 12px' }}>
              제{i + 1}조. 본 약관은 서비스 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임
              사항을 규정합니다. 내용이 넘치면 머리글과 버튼은 고정되고 이 영역만 스크롤됩니다.
            </p>
          ))}
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">닫기</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button>동의</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const WithoutDescription: Story = {
  name: '설명 없음',
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">공유</Button>
      </Dialog.Trigger>
      {/* 설명이 없으면 aria-describedby={undefined} 로 명시한다 */}
      <Dialog.Content {...args} size="sm" aria-describedby={undefined}>
        <Dialog.Header>
          <Dialog.Title>링크 공유</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Input aria-label="공유 링크" readOnly defaultValue="https://example.com/s/abc123" />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button>완료</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const HiddenTitle: Story = {
  name: '보이지 않는 제목',
  render: (args) => (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="secondary">이미지 크게 보기</Button>
      </Dialog.Trigger>
      <Dialog.Content {...args} size="lg" aria-describedby={undefined}>
        {/* 화면에 제목이 없어도 스크린리더용 이름은 반드시 둔다 */}
        <VisuallyHidden asChild>
          <Dialog.Title>상품 이미지</Dialog.Title>
        </VisuallyHidden>
        <Dialog.Body>
          <div
            role="img"
            aria-label="상품 사진 자리"
            style={{
              aspectRatio: '16 / 9',
              borderRadius: 8,
              background: 'var(--hds-color-bg-muted)',
            }}
          />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  ),
};

export const Controlled: Story = {
  name: '제어 모드',
  render: function ControlledStory(args) {
    const [open, setOpen] = useState(false);
    const [saved, setSaved] = useState('');
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button>닉네임 변경</Button>
          </Dialog.Trigger>
          <Dialog.Content {...args} size="sm">
            <form
              style={{ display: 'contents' }}
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setSaved(String(data.get('nickname') ?? ''));
                setOpen(false);
              }}
            >
              <Dialog.Header>
                <Dialog.Title>닉네임 변경</Dialog.Title>
                <Dialog.Description>저장하면 다이얼로그가 닫힙니다.</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <Field.Root required>
                  <Field.Label>닉네임</Field.Label>
                  <Input name="nickname" autoComplete="nickname" />
                </Field.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button variant="secondary">취소</Button>
                </Dialog.Close>
                <Button type="submit">저장</Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Root>
        <p role="status" style={{ margin: 0, color: 'var(--hds-color-fg-muted)' }}>
          {saved ? `저장됨: ${saved}` : '아직 저장하지 않았습니다.'}
        </p>
      </div>
    );
  },
};
