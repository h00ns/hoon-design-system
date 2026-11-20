import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Textarea } from '@hoon-ds/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { 'aria-label': '메모', placeholder: '내용을 입력하세요' },
  argTypes: {
    resize: { control: 'inline-radio', options: ['none', 'vertical', 'horizontal', 'both'] },
    autoResize: { control: 'boolean' },
    minRows: { control: { type: 'number', min: 1 } },
    maxRows: { control: { type: 'number', min: 1 } },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithField: Story = {
  render: (args) => (
    <Field.Root>
      <Field.Label>문의 내용</Field.Label>
      <Textarea {...args} aria-label={undefined} />
      <Field.Description>답변은 영업일 기준 1일 안에 메일로 드립니다.</Field.Description>
    </Field.Root>
  ),
};

export const AutoResize: Story = {
  args: { autoResize: true, minRows: 2, maxRows: 6, placeholder: '입력하면 6줄까지 늘어납니다' },
};

export const CharacterCount: Story = {
  render: function CountStory(args) {
    const max = 100;
    const [value, setValue] = useState('');
    const over = value.length > max;
    return (
      <Field.Root invalid={over}>
        <Field.Label>한 줄 소개</Field.Label>
        <Textarea
          {...args}
          aria-label={undefined}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Field.Description>
          {value.length} / {max}자
        </Field.Description>
        <Field.ErrorMessage>{max}자 이하로 입력하세요.</Field.ErrorMessage>
      </Field.Root>
    );
  },
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Textarea {...args} aria-label="오류" invalid defaultValue="잘못된 값" />
      <Textarea {...args} aria-label="읽기 전용" readOnly defaultValue="읽기 전용 내용" />
      <Textarea {...args} aria-label="비활성" disabled />
    </div>
  ),
};
