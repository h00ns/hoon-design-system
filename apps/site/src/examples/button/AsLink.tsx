import { Button } from '@hoon-ds/react';

export default function AsLinkExample() {
  return (
    <Button asChild variant="secondary">
      <a href="#links">문서 보기</a>
    </Button>
  );
}
