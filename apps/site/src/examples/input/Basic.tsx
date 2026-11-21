import { Field, Input } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 360 }}>
      <Field.Label>이메일</Field.Label>
      <Input type="email" autoComplete="email" placeholder="name@company.com" />
      <Field.Description>업무용 메일을 입력하세요.</Field.Description>
    </Field.Root>
  );
}
