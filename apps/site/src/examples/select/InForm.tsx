import { Button, Field, Select } from '@hoon-ds/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

export default function InFormExample() {
  const [submitted, setSubmitted] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // name 이 있으면 숨겨진 네이티브 <select> 로 값이 함께 제출된다
    const data = new FormData(event.currentTarget);
    setSubmitted(String(data.get('fruit') ?? ''));
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 280 }}>
      <Field.Root required>
        <Field.Label>과일</Field.Label>
        <Select.Root name="fruit">
          <Select.Trigger>
            <Select.Value placeholder="과일을 선택하세요" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="apple">사과</Select.Item>
            <Select.Item value="banana">바나나</Select.Item>
            <Select.Item value="grape">포도</Select.Item>
          </Select.Content>
        </Select.Root>
      </Field.Root>
      <Button type="submit">제출</Button>
      <output>{submitted !== null && `제출된 값: ${submitted || '(없음)'}`}</output>
    </form>
  );
}
