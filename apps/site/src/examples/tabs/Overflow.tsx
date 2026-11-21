import { Tabs } from '@hoon-ds/react';

const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

export default function OverflowExample() {
  return (
    <Tabs.Root defaultValue="1월" style={{ width: '100%', maxWidth: 320 }}>
      <Tabs.List aria-label="월별 리포트">
        {MONTHS.map((month) => (
          <Tabs.Trigger key={month} value={month}>
            {month}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {MONTHS.map((month) => (
        <Tabs.Content key={month} value={month}>
          <p>
            {month} 리포트입니다. 화살표 키로 이동하면 포커스된 탭이 보이는 곳으로 스크롤됩니다.
          </p>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
