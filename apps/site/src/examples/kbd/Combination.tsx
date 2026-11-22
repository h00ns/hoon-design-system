import { Kbd } from '@hoon-ds/react';

export default function CombinationExample() {
  return (
    <>
      <Kbd keys={['⌘', 'K']} />
      <Kbd keys={['Ctrl', 'Shift', 'P']} separator="+" />
      <Kbd keys={['⌥', '↑']} />
    </>
  );
}
