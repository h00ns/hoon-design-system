import { Checkbox } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Checkbox name="terms" required>
      이용약관에 동의합니다
    </Checkbox>
  );
}
