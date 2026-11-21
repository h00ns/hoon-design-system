import { Checkbox } from '@hoon-ds/react';

export default function LongLabelExample() {
  return (
    <div style={{ maxWidth: 320 }}>
      <Checkbox>
        여러 줄로 넘어가는 긴 레이블도 체크박스가 첫 줄 가운데에 맞춰 정렬되고, 레이블 어디를 눌러도
        토글된다.
      </Checkbox>
    </div>
  );
}
