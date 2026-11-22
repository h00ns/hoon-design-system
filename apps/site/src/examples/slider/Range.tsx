import { Field, Slider } from '@hoon-ds/react';
import { useState } from 'react';

const won = (value: number) => `${value.toLocaleString('ko-KR')}원`;

export default function RangeExample() {
  const [price, setPrice] = useState([20000, 80000]);

  return (
    <Field.Root style={{ width: '100%', maxWidth: 320 }}>
      <Field.Label>가격</Field.Label>
      {/* 손잡이는 "가격 최솟값", "가격 최댓값" 으로 읽힌다 */}
      <Slider
        value={price}
        onValueChange={setPrice}
        min={0}
        max={100000}
        step={1000}
        minStepsBetweenThumbs={5}
        getValueText={won}
      />
      <Field.Description>
        {won(price[0] ?? 0)}부터 {won(price[1] ?? 0)}까지
      </Field.Description>
    </Field.Root>
  );
}
