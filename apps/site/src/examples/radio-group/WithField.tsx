import { Field, RadioGroup } from '@hoon-ds/react';

export default function WithFieldExample() {
  return (
    <Field.Root required>
      <Field.Label>배송 방법</Field.Label>
      <RadioGroup.Root name="shipping" defaultValue="normal">
        <RadioGroup.Item value="normal" description="2~3일 · 무료">
          일반 배송
        </RadioGroup.Item>
        <RadioGroup.Item value="fast" description="오늘 주문 시 내일 도착 · 3,000원">
          빠른 배송
        </RadioGroup.Item>
        <RadioGroup.Item
          value="pickup"
          description="재고가 있는 매장만 선택할 수 있습니다"
          disabled
        >
          매장 픽업
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Field.Root>
  );
}
