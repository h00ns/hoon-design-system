import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, IconButton, Input } from '@hoon-ds/react';
import { useState } from 'react';

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="9" cy="9" r="5.5" />
    <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
  </svg>
);

const EyeIcon = ({ off = false }: { off?: boolean }) => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M2 10s3-5.5 8-5.5S18 10 18 10s-3 5.5-8 5.5S2 10 2 10Z" />
    <circle cx="10" cy="10" r="2.5" />
    {off && <path d="m3 3 14 14" strokeLinecap="round" />}
  </svg>
);

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { 'aria-label': '이름', placeholder: '홍길동' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    startSlot: { control: false },
    endSlot: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithField: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>이메일</Field.Label>
      <Input {...args} aria-label={undefined} type="email" placeholder="name@company.com" />
      <Field.Description>업무용 메일을 입력하세요.</Field.Description>
    </Field.Root>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Input {...args} size="sm" aria-label="작게" placeholder="sm (32px)" />
      <Input {...args} size="md" aria-label="보통" placeholder="md (40px)" />
      <Input {...args} size="lg" aria-label="크게" placeholder="lg (48px)" />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Input {...args} aria-label="기본" placeholder="기본" />
      <Input {...args} aria-label="오류" invalid defaultValue="잘못된 값" />
      <Input {...args} aria-label="읽기 전용" readOnly defaultValue="읽기 전용" />
      <Input {...args} aria-label="비활성" disabled placeholder="비활성" />
    </div>
  ),
};

export const WithSlots: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Input
        {...args}
        type="search"
        aria-label="상품 검색"
        placeholder="검색어 입력"
        startSlot={<SearchIcon />}
      />
      <Input {...args} aria-label="금액 (원)" inputMode="numeric" placeholder="0" endSlot="원" />
      <Input
        {...args}
        aria-label="도메인"
        placeholder="my-site"
        startSlot="https://"
        endSlot=".com"
      />
    </div>
  ),
};

export const Password: Story = {
  render: function PasswordStory(args) {
    const [visible, setVisible] = useState(false);
    return (
      <Field.Root>
        <Field.Label>비밀번호</Field.Label>
        <Input
          {...args}
          aria-label={undefined}
          placeholder={undefined}
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          endSlot={
            <IconButton
              size="sm"
              aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
              aria-pressed={visible}
              onClick={() => setVisible((v) => !v)}
            >
              <EyeIcon off={visible} />
            </IconButton>
          }
        />
      </Field.Root>
    );
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Field.Root invalid required>
      <Field.Label>이메일</Field.Label>
      <Input {...args} aria-label={undefined} type="email" defaultValue="name@" />
      <Field.ErrorMessage>이메일 형식이 올바르지 않습니다. 예: name@company.com</Field.ErrorMessage>
    </Field.Root>
  ),
};
