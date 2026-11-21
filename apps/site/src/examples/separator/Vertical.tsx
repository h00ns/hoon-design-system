import { Button, Separator } from '@hoon-ds/react';

export default function VerticalExample() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}>
      <Button variant="ghost" size="sm">
        굵게
      </Button>
      <Button variant="ghost" size="sm">
        기울임
      </Button>
      <Separator orientation="vertical" />
      <Button variant="ghost" size="sm">
        링크
      </Button>
    </div>
  );
}
