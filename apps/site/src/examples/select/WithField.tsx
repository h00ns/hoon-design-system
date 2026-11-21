import { Field, Select } from '@hoon-ds/react';
import { useState } from 'react';

export default function WithFieldExample() {
  const [country, setCountry] = useState('');

  return (
    <Field.Root invalid={country === ''} required style={{ width: '100%', maxWidth: 280 }}>
      <Field.Label>배송 국가</Field.Label>
      <Select.Root value={country} onValueChange={setCountry}>
        <Select.Trigger>
          <Select.Value placeholder="국가를 선택하세요" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="kr">대한민국</Select.Item>
          <Select.Item value="jp">일본</Select.Item>
          <Select.Item value="us">미국</Select.Item>
        </Select.Content>
      </Select.Root>
      <Field.Description>배송 가능한 국가만 표시됩니다.</Field.Description>
      <Field.ErrorMessage>배송 국가를 선택하세요.</Field.ErrorMessage>
    </Field.Root>
  );
}
