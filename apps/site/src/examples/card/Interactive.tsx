import { Badge, Button, Card } from '@hoon-ds/react';

export default function InteractiveExample() {
  return (
    <Card.Root interactive style={{ width: '100%', maxWidth: 360 }}>
      <Card.Header>
        <Badge tone="accent">가이드</Badge>
        <Card.Title>
          {/* 이 링크의 클릭 영역이 카드 전체로 넓어진다 */}
          <Card.Link href="#checklist">배포 전 접근성 체크리스트</Card.Link>
        </Card.Title>
        <Card.Description>키보드, 스크린리더, 대비를 10분 안에 확인하는 방법</Card.Description>
      </Card.Header>
      <Card.Footer>
        {/* 카드 안의 버튼은 링크와 별개로 동작한다 */}
        <Button size="sm" variant="secondary" onClick={() => alert('저장했습니다')}>
          나중에 읽기
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
