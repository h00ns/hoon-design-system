import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, Switch } from '@hoon-ds/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: { children: '알림 받기' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    labelPosition: { control: 'inline-radio', options: ['end', 'start'] },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch size="sm">작게 (sm)</Switch>
      <Switch size="md">보통 (md)</Switch>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Switch>꺼짐</Switch>
      <Switch defaultChecked>켜짐</Switch>
      <Switch disabled>비활성 · 꺼짐</Switch>
      <Switch disabled defaultChecked>
        비활성 · 켜짐
      </Switch>
    </div>
  ),
};

export const SettingsList: Story = {
  render: function SettingsStory() {
    const [push, setPush] = useState(true);
    const [email, setEmail] = useState(false);
    const row = { display: 'flex', justifyContent: 'space-between', width: 320 } as const;
    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <div style={row}>
          <Switch
            labelPosition="start"
            checked={push}
            onCheckedChange={setPush}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            푸시 알림
          </Switch>
        </div>
        <div style={row}>
          <Switch
            labelPosition="start"
            checked={email}
            onCheckedChange={setEmail}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            이메일 알림
          </Switch>
        </div>
      </div>
    );
  },
};

export const WithField: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>자동 저장</Field.Label>
      <Switch defaultChecked />
      <Field.Description>작성 중인 내용을 1분마다 저장합니다.</Field.Description>
    </Field.Root>
  ),
};
