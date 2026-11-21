import { Field, Textarea } from '@hoon-ds/react';
import { useState } from 'react';

const MAX = 100;

export default function CharacterCountExample() {
  const [value, setValue] = useState('');
  const over = value.length > MAX;

  return (
    <Field.Root invalid={over} style={{ width: '100%', maxWidth: 400 }}>
      <Field.Label>한 줄 소개</Field.Label>
      {/* maxLength 로 자르지 않고, 넘치면 오류로 알린다 */}
      <Textarea value={value} onChange={(e) => setValue(e.target.value)} />
      <Field.Description>
        {value.length} / {MAX}자
      </Field.Description>
      <Field.ErrorMessage>{MAX}자 이하로 입력하세요.</Field.ErrorMessage>
    </Field.Root>
  );
}
