import { Button, Combobox, Field } from '@hoon-ds/react';
import { useState } from 'react';

const TEAMS = [
  { value: 'design', label: '디자인' },
  { value: 'frontend', label: '프런트엔드' },
  { value: 'backend', label: '백엔드' },
  { value: 'data', label: '데이터' },
  { value: 'marketing', label: '마케팅' },
];

export default function ControlledExample() {
  const [team, setTeam] = useState<string | null>('frontend');

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
      <Field.Root>
        <Field.Label>소속 팀</Field.Label>
        <Combobox options={TEAMS} value={team} onValueChange={setTeam} />
      </Field.Root>
      <p style={{ margin: 0 }}>선택된 값: {team ?? '없음'}</p>
      <Button variant="secondary" size="sm" onClick={() => setTeam('design')}>
        디자인 팀으로 바꾸기
      </Button>
    </div>
  );
}
