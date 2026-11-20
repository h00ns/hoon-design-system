import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, RadioGroup } from '@hoon-ds/react';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup.Root,
  subcomponents: { 'RadioGroup.Item': RadioGroup.Item },
  args: { 'aria-label': '배송 방법', defaultValue: 'normal' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Item value="normal">일반 배송</RadioGroup.Item>
      <RadioGroup.Item value="fast">빠른 배송</RadioGroup.Item>
      <RadioGroup.Item value="pickup">매장 픽업</RadioGroup.Item>
    </RadioGroup.Root>
  ),
} satisfies Meta<typeof RadioGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithField: Story = {
  render: () => (
    <Field.Root required>
      <Field.Label>배송 방법</Field.Label>
      <RadioGroup.Root name="shipping" defaultValue="normal">
        <RadioGroup.Item value="normal" description="2–3일 · 무료">
          일반 배송
        </RadioGroup.Item>
        <RadioGroup.Item value="fast" description="오늘 주문 시 내일 도착 · 3,000원">
          빠른 배송
        </RadioGroup.Item>
        <RadioGroup.Item
          value="pickup"
          description="재고가 있는 매장만 선택할 수 있습니다"
          disabled
        >
          매장 픽업
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>
  ),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal', 'aria-label': '사이즈', defaultValue: 'm' },
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Item value="s">S</RadioGroup.Item>
      <RadioGroup.Item value="m">M</RadioGroup.Item>
      <RadioGroup.Item value="l">L</RadioGroup.Item>
      <RadioGroup.Item value="xl">XL</RadioGroup.Item>
    </RadioGroup.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root invalid required>
      <Field.Label>결제 수단</Field.Label>
      <RadioGroup.Root name="payment">
        <RadioGroup.Item value="card">신용·체크카드</RadioGroup.Item>
        <RadioGroup.Item value="bank">계좌이체</RadioGroup.Item>
      </RadioGroup.Root>
      <Field.ErrorMessage>결제 수단을 선택하세요.</Field.ErrorMessage>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};
