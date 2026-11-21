import { Button, toast } from '@hoon-ds/react';

export default function WithActionExample() {
  const deleteMail = () => {
    toast({
      title: '메일 1통을 삭제했습니다',
      action: {
        label: '되돌리기',
        // 스크린리더 사용자는 토스트로 포커스를 옮기지 않으므로 다른 경로를 알려준다 (필수)
        altText: '휴지통에서 메일을 되돌릴 수 있습니다',
        onClick: () => toast.success('메일을 되돌렸습니다'),
      },
    });
  };

  return (
    <Button variant="danger" onClick={deleteMail}>
      메일 삭제
    </Button>
  );
}
