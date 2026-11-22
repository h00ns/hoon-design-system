import { Button, Combobox, Field } from '@hoon-ds/react';
import { useState } from 'react';

const LANGUAGES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: '영어', keywords: ['english'] },
  { value: 'ja', label: '일본어', keywords: ['japanese'] },
  { value: 'zh', label: '중국어', keywords: ['chinese'] },
];

export default function InFormExample() {
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`language=${data.get('language') ?? ''}`);
      }}
    >
      <Field.Root>
        <Field.Label>언어</Field.Label>
        <Combobox options={LANGUAGES} name="language" defaultValue="ko" />
      </Field.Root>
      <Button type="submit">저장</Button>
      {result && <output>{result}</output>}
    </form>
  );
}
