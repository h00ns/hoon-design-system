import { Tabs } from '@hoon-ds/react';

export default function ManualActivationExample() {
  return (
    <Tabs.Root
      activationMode="manual"
      defaultValue="daily"
      style={{ width: '100%', maxWidth: 480 }}
    >
      <Tabs.List aria-label="매출 리포트 기간">
        <Tabs.Trigger value="daily">일간</Tabs.Trigger>
        <Tabs.Trigger value="weekly">주간</Tabs.Trigger>
        <Tabs.Trigger value="monthly">월간</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="daily">
        <p>화살표로 이동한 뒤 Enter 나 Space 를 눌러야 리포트를 불러옵니다.</p>
      </Tabs.Content>
      <Tabs.Content value="weekly">
        <p>주간 리포트입니다.</p>
      </Tabs.Content>
      <Tabs.Content value="monthly">
        <p>월간 리포트입니다.</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
