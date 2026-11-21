import { Tabs } from '@hoon-ds/react';

export default function DisabledTabExample() {
  return (
    <Tabs.Root defaultValue="overview" style={{ width: '100%', maxWidth: 480 }}>
      <Tabs.List aria-label="프로젝트">
        <Tabs.Trigger value="overview">개요</Tabs.Trigger>
        <Tabs.Trigger value="members">멤버</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          결제 (관리자 전용)
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <p>프로젝트 요약입니다.</p>
      </Tabs.Content>
      <Tabs.Content value="members">
        <p>프로젝트에 참여한 사람들입니다.</p>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <p>결제 정보입니다.</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
