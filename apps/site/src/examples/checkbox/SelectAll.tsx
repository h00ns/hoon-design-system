import { Checkbox } from '@hoon-ds/react';
import type { CheckedState } from '@hoon-ds/react';
import { useState } from 'react';

const ITEMS = [
  { id: 'service', label: '[필수] 서비스 이용약관' },
  { id: 'privacy', label: '[필수] 개인정보 수집·이용' },
  { id: 'marketing', label: '[선택] 마케팅 정보 수신' },
];

export default function SelectAllExample() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const count = ITEMS.filter((item) => checked[item.id]).length;
  // 일부만 선택되면 'indeterminate' → 스크린리더는 "일부 선택됨(mixed)"으로 읽는다
  const all: CheckedState = count === ITEMS.length ? true : count === 0 ? false : 'indeterminate';

  const toggleAll = (next: CheckedState) =>
    setChecked(Object.fromEntries(ITEMS.map((item) => [item.id, next === true])));

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Checkbox checked={all} onCheckedChange={toggleAll}>
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
}
