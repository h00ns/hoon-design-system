import { Alert, Button } from '@hoon-ds/react';
import { useState } from 'react';

export default function LiveAssertiveExample() {
  const [error, setError] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start', width: '100%', maxWidth: 560 }}>
      <Button variant="danger" onClick={() => setError(true)}>
        저장 (실패 재현)
      </Button>
      {error && (
        // 나중에 나타나는 오류는 assertive 로 스크린리더가 바로 읽게 한다
        <Alert
          tone="danger"
          live="assertive"
          title="저장하지 못했습니다"
          onClose={() => setError(false)}
        >
          네트워크 연결을 확인한 뒤 다시 시도해 주세요.
        </Alert>
      )}
    </div>
  );
}
