import { Field, Slider } from '@hoon-ds/react';

const LEVELS = ['아주 작게', '작게', '보통', '크게', '아주 크게'];

export default function MarksExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 360 }}>
      <Field.Label>글자 크기</Field.Label>
      <Slider
        defaultValue={[2]}
        min={0}
        max={4}
        step={1}
        // 눈금은 시각 보조일 뿐이므로 값 문구는 getValueText 로 따로 준다
        getValueText={(v) => LEVELS[v] ?? ''}
        marks={[
          { value: 0, label: '아주 작게' },
          { value: 1 },
          { value: 2, label: '보통' },
          { value: 3 },
          { value: 4, label: '아주 크게' },
        ]}
      />
    </Field.Root>
  );
}
