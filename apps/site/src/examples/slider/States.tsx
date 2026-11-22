import { Field, Slider } from '@hoon-ds/react';

export default function StatesExample() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 320 }}>
      <Field.Root invalid>
        <Field.Label>월 예산</Field.Label>
        <Slider defaultValue={[90]} getValueText={(v) => `${v}만 원`} />
        <Field.ErrorMessage>설정한 한도를 넘었습니다.</Field.ErrorMessage>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>밝기</Field.Label>
        <Slider defaultValue={[50]} />
        <Field.Description>자동 밝기가 켜져 있습니다.</Field.Description>
      </Field.Root>
    </div>
  );
}
