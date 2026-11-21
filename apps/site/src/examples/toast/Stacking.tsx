import { Button, toast } from '@hoon-ds/react';
import { useRef } from 'react';

export default function StackingExample() {
  const count = useRef(0);

  const showMany = () => {
    for (let i = 0; i < 5; i += 1) {
      count.current += 1;
      toast(`알림 ${count.current}`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="secondary" onClick={showMany}>
        5개 한꺼번에 (limit 초과분은 대기)
      </Button>
      <Button variant="danger" onClick={() => toast.error('결제에 실패했습니다')}>
        오류 (대기 없이 표시)
      </Button>
    </div>
  );
}
