import { Field, Switch } from '@hoon-ds/react';

export default function WithFieldExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 360 }}>
      <Field.Label>자동 저장</Field.Label>
      <Switch defaultChecked />
      <Field.Description>작성 중인 내용을 1분마다 저장합니다.</Field.Description>
    </Field.Root>
  );
}
