import { RadioGroup } from '@hoon-ds/react';

export default function HorizontalExample() {
  return (
    <RadioGroup.Root orientation="horizontal" aria-label="사이즈" defaultValue="m">
      <RadioGroup.Item value="s">S</RadioGroup.Item>
      <RadioGroup.Item value="m">M</RadioGroup.Item>
      <RadioGroup.Item value="l">L</RadioGroup.Item>
      <RadioGroup.Item value="xl">XL</RadioGroup.Item>
    </RadioGroup.Root>
  );
}
