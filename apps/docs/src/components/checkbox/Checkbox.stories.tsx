import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Field } from '@hoon-ds/react';
import type { CheckedState } from '@hoon-ds/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: { children: '이용약관에 동의합니다' },
  argTypes: {
    checked: { control: 'inline-radio', options: [true, false, 'indeterminate'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox>선택 안 됨</Checkbox>
      <Checkbox defaultChecked>선택됨</Checkbox>
      <Checkbox checked="indeterminate">일부 선택</Checkbox>
      <Checkbox disabled>비활성</Checkbox>
      <Checkbox disabled defaultChecked>
        비활성 · 선택됨
      </Checkbox>
    </div>
  ),
};

const ITEMS = [
  { id: 'service', label: '[필수] 서비스 이용약관' },
  { id: 'privacy', label: '[필수] 개인정보 수집·이용' },
  { id: 'marketing', label: '[선택] 마케팅 정보 수신' },
];

export const SelectAll: Story = {
  render: function SelectAllStory() {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const count = ITEMS.filter((item) => checked[item.id]).length;
    const all: CheckedState = count === ITEMS.length ? true : count === 0 ? false : 'indeterminate';
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Checkbox
          checked={all}
          onCheckedChange={(next) =>
            setChecked(Object.fromEntries(ITEMS.map((item) => [item.id, next === true])))
          }
        >
          <strong>전체 동의</strong>
        </Checkbox>
        <div
          role="group"
          aria-label="약관 항목"
          style={{ display: 'grid', gap: 8, paddingInlineStart: 26 }}
        >
          {ITEMS.map((item) => (
            <Checkbox
              key={item.id}
              checked={!!checked[item.id]}
              onCheckedChange={(next) =>
                setChecked((prev) => ({ ...prev, [item.id]: next === true }))
              }
            >
              {item.label}
            </Checkbox>
          ))}
        </div>
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => (
    <Field.Root invalid required>
      <Checkbox name="privacy">개인정보 수집·이용에 동의합니다</Checkbox>
      <Field.Description>수집 항목: 이름, 이메일 · 보유 기간: 회원 탈퇴 시까지</Field.Description>
      <Field.ErrorMessage>동의해야 가입할 수 있습니다.</Field.ErrorMessage>
    </Field.Root>
  ),
};

export const LongLabel: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Checkbox>
        여러 줄로 넘어가는 긴 레이블도 체크박스가 첫 줄 가운데에 맞춰 정렬되고, 레이블 어디를 눌러도
        토글된다.
      </Checkbox>
    </div>
  ),
};
