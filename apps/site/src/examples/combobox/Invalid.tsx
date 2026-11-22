import { Combobox, Field } from '@hoon-ds/react';
import { useState } from 'react';

const COUNTRIES = [
  { value: 'kr', label: '대한민국', keywords: ['korea'] },
  { value: 'jp', label: '일본', keywords: ['japan'] },
  { value: 'us', label: '미국', keywords: ['usa', 'united states'] },
  { value: 'de', label: '독일', keywords: ['germany'] },
];

export default function InvalidExample() {
  const [country, setCountry] = useState<string | null>(null);

  return (
    <Field.Root invalid={country === null} required style={{ width: '100%', maxWidth: 320 }}>
      <Field.Label>배송 국가</Field.Label>
      <Combobox options={COUNTRIES} value={country} onValueChange={setCountry} />
      <Field.ErrorMessage>배송 국가를 선택하세요.</Field.ErrorMessage>
    </Field.Root>
  );
}
