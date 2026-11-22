import { Button, Card } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Card.Root style={{ width: '100%', maxWidth: 340 }}>
      <Card.Header>
        <Card.Title>Pro 요금제</Card.Title>
        <Card.Description>팀 단위로 쓰는 모든 기능</Card.Description>
      </Card.Header>
      <Card.Body>월 29,000원부터. 언제든 해지할 수 있습니다.</Card.Body>
      <Card.Footer>
        <Button>시작하기</Button>
        <Button variant="ghost">요금 비교</Button>
      </Card.Footer>
    </Card.Root>
  );
}
