import { Field, Input } from '@hoon-ds/react';

export default function InvalidExample() {
  return (
    <Field.Root invalid required style={{ width: '100%', maxWidth: 360 }}>
      <Field.Label>이메일</Field.Label>
      <Input type="email" autoComplete="email" defaultValue="name@" />
      <Field.Description>로그인과 알림에 사용됩니다.</Field.Description>
      <Field.ErrorMessage>이메일 형식이 올바르지 않습니다. 예: name@company.com</Field.ErrorMessage>
    </Field.Root>
  );
}
