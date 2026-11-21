import { Checkbox, Field, RadioGroup, Textarea } from '@hoon-ds/react';

export default function MultipleControlsExample() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 360 }}>
      <Field.Root>
        <Field.Label>문의 내용</Field.Label>
        <Textarea autoResize />
        <Field.Description>최대 500자</Field.Description>
      </Field.Root>

      {/* 그룹 컨트롤은 aria-labelledby 로 레이블이 연결된다 */}
      <Field.Root>
        <Field.Label>배송 방법</Field.Label>
        <RadioGroup.Root defaultValue="normal">
          <RadioGroup.Item value="normal">일반 배송</RadioGroup.Item>
          <RadioGroup.Item value="fast">빠른 배송</RadioGroup.Item>
        </RadioGroup.Root>
      </Field.Root>

      {/* Checkbox 는 자신의 children 을 레이블로 쓰고, 설명만 Field 에서 받는다 */}
      <Field.Root>
        <Checkbox>마케팅 정보 수신에 동의합니다</Checkbox>
        <Field.Description>언제든 설정에서 해제할 수 있습니다.</Field.Description>
      </Field.Root>
    </div>
  );
}
