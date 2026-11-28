import { Badge, Button, VisuallyHidden } from '@hoon-ds/react';

export default function CountExample() {
  return (
    <Button variant="secondary">
      알림
      <Badge tone="critical" variant="solid" size="sm">
        3<VisuallyHidden>개의 새 알림</VisuallyHidden>
      </Badge>
    </Button>
  );
}
