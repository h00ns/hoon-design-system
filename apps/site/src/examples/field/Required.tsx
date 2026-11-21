import { Field, Input } from '@hoon-ds/react';

export default function RequiredExample() {
  return (
    <Field.Root required style={{ width: '100%', maxWidth: 360 }}>
      <Field.Label>이메일</Field.Label>
      <Input type="email" autoComplete="email" placeholder="name@company.com" />
      <Field.Description>로그인과 알림에 사용됩니다.</Field.Description>
    </Field.Root>
  );
}
