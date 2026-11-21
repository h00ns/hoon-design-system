import { Field, RadioGroup } from '@hoon-ds/react';

export default function InvalidExample() {
  return (
    <Field.Root invalid required>
      <Field.Label>결제 수단</Field.Label>
      <RadioGroup.Root name="payment">
        <RadioGroup.Item value="card">신용·체크카드</RadioGroup.Item>
        <RadioGroup.Item value="bank">계좌이체</RadioGroup.Item>
      </RadioGroup.Root>
      <Field.ErrorMessage>결제 수단을 선택하세요.</Field.ErrorMessage>
    </Field.Root>
  );
}
