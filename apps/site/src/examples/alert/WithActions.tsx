import { Alert, Button } from '@hoon-ds/react';

export default function WithActionsExample() {
  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Alert
        tone="warning"
        title="새 버전이 있습니다"
        actions={
          <>
            <Button size="sm" variant="ghost">
              나중에
            </Button>
            <Button size="sm">업데이트</Button>
          </>
        }
      >
        업데이트하면 최신 기능과 보안 패치가 적용됩니다.
      </Alert>
    </div>
  );
}
