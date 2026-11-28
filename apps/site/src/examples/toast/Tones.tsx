import { Button, toast } from '@hoon-ds/react';

export default function TonesExample() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button variant="secondary" onClick={() => toast('링크를 복사했습니다')}>
        Neutral
      </Button>
      <Button variant="secondary" onClick={() => toast.info('새 댓글이 2개 있습니다')}>
        Info
      </Button>
      <Button variant="secondary" onClick={() => toast.success('결제가 완료되었습니다')}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast.warning('저장 공간이 거의 찼습니다')}>
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.critical('업로드에 실패했습니다', { description: '파일이 10MB를 넘습니다.' })
        }
      >
        Critical
      </Button>
    </div>
  );
}
