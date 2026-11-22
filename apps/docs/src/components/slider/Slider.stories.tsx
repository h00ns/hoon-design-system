import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Slider } from '@hoon-ds/react';
import { useState } from 'react';

const won = (v: number) => `${v.toLocaleString('ko-KR')}원`;

const meta = {
  title: 'Components/Slider',
  component: Slider,
  args: { 'aria-label': '음량', defaultValue: [40] },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    step: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Range: Story = {
  render: function RangeStory() {
    const [value, setValue] = useState([20000, 80000]);
    return (
      <Field.Root>
        <Field.Label>가격</Field.Label>
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={100000}
          step={1000}
          getValueText={won}
        />
        <Field.Description>
          {won(value[0] ?? 0)} ~ {won(value[1] ?? 0)}
        </Field.Description>
      </Field.Root>
    );
  },
};

export const Marks: Story = {
  args: {
    'aria-label': '글자 크기',
    defaultValue: [2],
    min: 0,
    max: 4,
    step: 1,
    marks: [
      { value: 0, label: '아주 작게' },
      { value: 1 },
      { value: 2, label: '보통' },
      { value: 3 },
      { value: 4, label: '아주 크게' },
    ],
    getValueText: (v: number) => ['아주 작게', '작게', '보통', '크게', '아주 크게'][v] ?? '',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Slider aria-label="작은 슬라이더" size="sm" defaultValue={[30]} />
      <Slider aria-label="보통 슬라이더" size="md" defaultValue={[60]} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Field.Root invalid>
        <Field.Label>예산</Field.Label>
        <Slider defaultValue={[90]} />
        <Field.ErrorMessage>예산을 넘었습니다.</Field.ErrorMessage>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>밝기</Field.Label>
        <Slider defaultValue={[50]} />
      </Field.Root>
    </div>
  ),
};

export const Vertical: Story = {
  decorators: [
    (Story) => (
      <div style={{ height: 200 }}>
        <Story />
      </div>
    ),
  ],
  args: { orientation: 'vertical', 'aria-label': '볼륨' },
};
