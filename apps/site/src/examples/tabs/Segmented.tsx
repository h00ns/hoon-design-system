import { Tabs } from '@hoon-ds/react';

export default function SegmentedExample() {
  return (
    <Tabs.Root variant="segmented" defaultValue="list" style={{ width: '100%', maxWidth: 480 }}>
      <Tabs.List aria-label="보기 방식">
        <Tabs.Trigger value="list">목록</Tabs.Trigger>
        <Tabs.Trigger value="board">보드</Tabs.Trigger>
        <Tabs.Trigger value="calendar">캘린더</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="list">
        <p>할 일을 한 줄씩 나열합니다.</p>
      </Tabs.Content>
      <Tabs.Content value="board">
        <p>상태별 열로 나눠 카드로 보여줍니다.</p>
      </Tabs.Content>
      <Tabs.Content value="calendar">
        <p>마감일 기준으로 달력에 배치합니다.</p>
      </Tabs.Content>
    </Tabs.Root>
  );
}
