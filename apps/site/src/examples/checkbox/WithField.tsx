import { Checkbox, Field } from '@hoon-ds/react';

export default function WithFieldExample() {
  return (
    <Field.Root invalid required style={{ width: '100%', maxWidth: 400 }}>
      <Checkbox name="privacy">개인정보 수집·이용에 동의합니다</Checkbox>
      <Field.Description>수집 항목: 이름, 이메일 · 보유 기간: 회원 탈퇴 시까지</Field.Description>
      <Field.ErrorMessage>동의해야 가입할 수 있습니다.</Field.ErrorMessage>
    </Field.Root>
  );
}
