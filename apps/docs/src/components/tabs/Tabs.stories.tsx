import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '@hoon-ds/react';
import type { ReactNode } from 'react';

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <div style={{ display: 'grid', gap: 8 }}>
    <strong>{title}</strong>
    <p style={{ margin: 0, color: 'var(--hds-color-fg-muted)' }}>{children}</p>
  </div>
);

const meta = {
  title: 'Components/Tabs',
  component: Tabs.Root,
  args: {
    variant: 'line',
    orientation: 'horizontal',
    activationMode: 'automatic',
    defaultValue: 'account',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'segmented'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    activationMode: { control: 'inline-radio', options: ['automatic', 'manual'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const SettingsTabs = (args: Tabs.TabsRootProps) => (
  <Tabs.Root {...args}>
    <Tabs.List aria-label="계정 설정">
      <Tabs.Trigger value="account">계정</Tabs.Trigger>
      <Tabs.Trigger value="password">비밀번호</Tabs.Trigger>
      <Tabs.Trigger value="alerts">알림</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="account">
      <Panel title="계정">이름과 이메일, 프로필 사진을 관리합니다.</Panel>
    </Tabs.Content>
    <Tabs.Content value="password">
      <Panel title="비밀번호">
        주기적으로 비밀번호를 바꾸면 계정을 더 안전하게 지킬 수 있습니다.
      </Panel>
    </Tabs.Content>
    <Tabs.Content value="alerts">
      <Panel title="알림">이메일과 푸시 알림을 받을 항목을 고릅니다.</Panel>
    </Tabs.Content>
  </Tabs.Root>
);

export const Playground: Story = {
  render: (args) => <SettingsTabs {...args} />,
};

export const Segmented: Story = {
  args: { variant: 'segmented' },
  render: (args) => <SettingsTabs {...args} />,
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => <SettingsTabs {...args} />,
};

export const ManualActivation: Story = {
  name: '수동 활성화 (manual)',
  args: { activationMode: 'manual' },
  render: (args) => <SettingsTabs {...args} />,
};

export const DisabledTab: Story = {
  name: '비활성 탭',
  render: (args) => (
    <Tabs.Root {...args} defaultValue="overview">
      <Tabs.List aria-label="프로젝트">
        <Tabs.Trigger value="overview">개요</Tabs.Trigger>
        <Tabs.Trigger value="members">멤버</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          결제 (관리자 전용)
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <Panel title="개요">프로젝트 요약입니다.</Panel>
      </Tabs.Content>
      <Tabs.Content value="members">
        <Panel title="멤버">프로젝트에 참여한 사람들입니다.</Panel>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <Panel title="결제">결제 정보입니다.</Panel>
      </Tabs.Content>
    </Tabs.Root>
  ),
};

const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

export const Overflow: Story = {
  name: '넘치는 탭',
  render: (args) => (
    <div style={{ width: 320 }}>
      <Tabs.Root {...args} defaultValue="1월">
        <Tabs.List aria-label="월별 리포트">
          {MONTHS.map((m) => (
            <Tabs.Trigger key={m} value={m}>
              {m}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {MONTHS.map((m) => (
          <Tabs.Content key={m} value={m}>
            <Panel title={`${m} 리포트`}>
              화살표 키로 이동하면 포커스된 탭이 보이는 곳으로 스크롤됩니다.
            </Panel>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  ),
};
