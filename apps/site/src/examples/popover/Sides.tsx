import { Button, Popover } from '@hoon-ds/react';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

export default function SidesExample() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      {SIDES.map((side) => (
        <Popover.Root key={side}>
          <Popover.Trigger asChild>
            <Button variant="secondary">{side}</Button>
          </Popover.Trigger>
          <Popover.Content side={side} arrow aria-label={`${side} 팝오버`}>
            side=&quot;{side}&quot;
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
