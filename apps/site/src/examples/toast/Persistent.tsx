import { Button, toast } from '@hoon-ds/react';

export default function PersistentExample() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning('오프라인 상태입니다', {
            id: 'offline',
            description: '연결되면 자동으로 동기화합니다.',
            duration: Infinity,
          })
        }
      >
        닫을 때까지 유지
      </Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>
        모두 닫기
      </Button>
    </div>
  );
}
