import { Button } from '@hoon-ds/react';

export default function DisabledExample() {
  return (
    <>
      <Button disabled>disabled</Button>
      <Button disabled focusableWhenDisabled>
        focusableWhenDisabled
      </Button>
    </>
  );
}
