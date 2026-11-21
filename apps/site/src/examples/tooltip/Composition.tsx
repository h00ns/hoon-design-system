import { Button, Tooltip } from '@hoon-ds/react';

export default function CompositionExample() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button variant="secondary">조립형</Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="bottom" arrow={false}>
        Root · Trigger · Content 를 직접 조합한다
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
