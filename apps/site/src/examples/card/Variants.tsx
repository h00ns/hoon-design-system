import { Card } from '@hoon-ds/react';

export default function VariantsExample() {
  return (
    <>
      <Card.Root variant="outline" style={{ width: 200 }}>
        <Card.Title>Outline</Card.Title>
        <Card.Description>기본. 테두리로 구분한다.</Card.Description>
      </Card.Root>
      <Card.Root variant="elevated" style={{ width: 200 }}>
        <Card.Title>Elevated</Card.Title>
        <Card.Description>그림자로 띄운다.</Card.Description>
      </Card.Root>
      <Card.Root variant="subtle" style={{ width: 200 }}>
        <Card.Title>Subtle</Card.Title>
        <Card.Description>옅은 배경으로 묶는다.</Card.Description>
      </Card.Root>
    </>
  );
}
