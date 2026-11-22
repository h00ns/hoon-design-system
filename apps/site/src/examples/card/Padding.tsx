import { Card } from '@hoon-ds/react';

export default function PaddingExample() {
  return (
    <>
      {(['sm', 'md', 'lg'] as const).map((padding) => (
        <Card.Root key={padding} padding={padding} variant="subtle">
          <Card.Title>{padding}</Card.Title>
          <Card.Description>안쪽 여백</Card.Description>
        </Card.Root>
      ))}
    </>
  );
}
