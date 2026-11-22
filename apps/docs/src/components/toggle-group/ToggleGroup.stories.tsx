import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Toggle, ToggleGroup } from '@hoon-ds/react';

const BoldIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M6 4h5a3 3 0 0 1 0 6H6zM6 10h6a3 3 0 0 1 0 6H6z" />
  </svg>
);
const ItalicIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 4H8M12 16H8M11 4 9 16" />
  </svg>
);
const UnderlineIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 4v6a4 4 0 0 0 8 0V4M5 17h10" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="m10 2.5 2.3 4.7 5.2.8-3.8 3.6.9 5.2L10 14.3l-4.6 2.5.9-5.2L2.5 8l5.2-.8L10 2.5Z" />
  </svg>
);

// ToggleGroup.Root 의 props 는 type(single|multiple) 유니언이라 args 추론이 되지 않는다.
// 모든 스토리가 render 를 쓰므로 컴포넌트 타입 없이 선언한다.
const meta = {
  title: 'Components/ToggleGroup',
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <ToggleGroup.Root type="single" aria-label="정렬" defaultValue="left">
      <ToggleGroup.Item value="left">왼쪽</ToggleGroup.Item>
      <ToggleGroup.Item value="center">가운데</ToggleGroup.Item>
      <ToggleGroup.Item value="right">오른쪽</ToggleGroup.Item>
    </ToggleGroup.Root>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup.Root type="multiple" aria-label="글자 서식" defaultValue={['bold']}>
      <ToggleGroup.Item value="bold" icon={<BoldIcon />} aria-label="굵게" />
      <ToggleGroup.Item value="italic" icon={<ItalicIcon />} aria-label="기울임" />
      <ToggleGroup.Item value="underline" icon={<UnderlineIcon />} aria-label="밑줄" />
    </ToggleGroup.Root>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <ToggleGroup.Root key={size} type="single" size={size} aria-label={`보기 ${size}`}>
          <ToggleGroup.Item value="day">일</ToggleGroup.Item>
          <ToggleGroup.Item value="week">주</ToggleGroup.Item>
          <ToggleGroup.Item value="month">월</ToggleGroup.Item>
        </ToggleGroup.Root>
      ))}
    </div>
  ),
};

export const WithField: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>보기 방식</Field.Label>
      <ToggleGroup.Root type="single" defaultValue="list">
        <ToggleGroup.Item value="grid">격자</ToggleGroup.Item>
        <ToggleGroup.Item value="list">목록</ToggleGroup.Item>
        <ToggleGroup.Item value="board" disabled>
          보드
        </ToggleGroup.Item>
      </ToggleGroup.Root>
      <Field.Description>보드 보기는 준비 중입니다.</Field.Description>
    </Field.Root>
  ),
};

export const StandaloneToggle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Toggle icon={<BoldIcon />}>굵게</Toggle>
      <Toggle icon={<StarIcon />} aria-label="즐겨찾기" defaultPressed />
      <Toggle disabled>비활성</Toggle>
    </div>
  ),
};
