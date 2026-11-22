import { Button, Field, Slider } from '@hoon-ds/react';
import { useState } from 'react';

export default function InFormExample() {
  const [result, setResult] = useState('');

  return (
    <form
      style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(`quality=${data.get('quality')}`);
      }}
    >
      <Field.Root>
        <Field.Label>이미지 품질</Field.Label>
        <Slider name="quality" defaultValue={[80]} getValueText={(v) => `${v}%`} />
      </Field.Root>
      <Button type="submit">저장</Button>
      {result && <output>{result}</output>}
    </form>
  );
}
