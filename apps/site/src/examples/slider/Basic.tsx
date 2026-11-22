import { Field, Slider } from '@hoon-ds/react';
import { useState } from 'react';

export default function BasicExample() {
  const [volume, setVolume] = useState([40]);

  return (
    <Field.Root style={{ width: '100%', maxWidth: 320 }}>
      <Field.Label>음량</Field.Label>
      <Slider value={volume} onValueChange={setVolume} getValueText={(v) => `${v}%`} />
      <Field.Description>현재 {volume[0]}%</Field.Description>
    </Field.Root>
  );
}
