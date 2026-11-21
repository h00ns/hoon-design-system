import { RadioGroup } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <RadioGroup.Root aria-label="배송 방법" defaultValue="normal">
      <RadioGroup.Item value="normal">일반 배송</RadioGroup.Item>
      <RadioGroup.Item value="fast">빠른 배송</RadioGroup.Item>
      <RadioGroup.Item value="pickup">매장 픽업</RadioGroup.Item>
    </RadioGroup.Root>
  );
}
