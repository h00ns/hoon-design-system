import { Tabs } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Tabs.Root defaultValue="account" style={{ width: '100%', maxWidth: 480 }}>
      <Tabs.List aria-label="계정 설정">
        <Tabs.Trigger value="account">계정</Tabs.Trigger>
        <Tabs.Trigger value="password">비밀번호</Tabs.Trigger>
        <Tabs.Trigger value="alerts">알림</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <p>이름과 이메일, 프로필 사진을 관리합니다.</p>
      </Tabs.Content>
      <Tabs.Content value="password">
        <p>주기적으로 비밀번호를 바꾸면 계정을 더 안전하게 지킬 수 있습니다.</p>
      </Tabs.Content>
      <Tabs.Content value="alerts">
        <p>이메일과 푸시 알림을 받을 항목을 고릅니다.</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
