import { Field, Input } from '@hoon-ds/react';

export default function DisabledExample() {
  return (
    <Field.Root disabled style={{ width: '100%', maxWidth: 360 }}>
      <Field.Label>이메일</Field.Label>
      <Input type="email" defaultValue="hong@company.com" />
      <Field.Description>관리자만 변경할 수 있습니다.</Field.Description>
    </Field.Root>
  );
}
