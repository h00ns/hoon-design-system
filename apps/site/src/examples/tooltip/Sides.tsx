import { Button, SimpleTooltip } from '@hoon-ds/react';

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

export default function SidesExample() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
      {SIDES.map((side) => (
        <SimpleTooltip key={side} side={side} content={`side="${side}"`}>
          <Button variant="secondary">{side}</Button>
        </SimpleTooltip>
      ))}
    </div>
  );
}
