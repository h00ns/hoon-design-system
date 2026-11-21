import { Field, Textarea } from '@hoon-ds/react';

export default function AutoResizeExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 400 }}>
      <Field.Label>메모</Field.Label>
      <Textarea autoResize minRows={2} maxRows={6} placeholder="입력하면 6줄까지 늘어납니다" />
    </Field.Root>
  );
}
