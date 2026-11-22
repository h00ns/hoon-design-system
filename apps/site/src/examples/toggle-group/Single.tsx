import { ToggleGroup } from '@hoon-ds/react';
import { useState } from 'react';

export default function SingleExample() {
  const [period, setPeriod] = useState('week');

  return (
    <ToggleGroup.Root
      type="single"
      aria-label="기간"
      value={period}
      // 다시 눌러 해제하면 빈 문자열이 온다. 항상 하나가 선택되어 있어야 하면 무시한다.
      onValueChange={(next) => next && setPeriod(next)}
    >
      <ToggleGroup.Item value="day">일</ToggleGroup.Item>
      <ToggleGroup.Item value="week">주</ToggleGroup.Item>
      <ToggleGroup.Item value="month">월</ToggleGroup.Item>
      <ToggleGroup.Item value="year">년</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
