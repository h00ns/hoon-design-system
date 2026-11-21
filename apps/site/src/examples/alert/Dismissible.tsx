import { Alert, Button } from '@hoon-ds/react';
import { useState } from 'react';

export default function DismissibleExample() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return (
      <Button variant="secondary" onClick={() => setOpen(true)}>
        안내 다시 보기
      </Button>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <Alert title="정기 점검 안내" onClose={() => setOpen(false)}>
        11월 22일 02:00–04:00 동안 일부 기능을 사용할 수 없습니다.
      </Alert>
    </div>
  );
}
