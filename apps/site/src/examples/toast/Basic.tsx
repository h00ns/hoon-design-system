import { Button, toast } from '@hoon-ds/react';

// <Toaster /> 는 앱 최상단에 한 번만 둔다. 여기서는 toast() 만 호출한다.
export default function BasicExample() {
  return (
    <Button onClick={() => toast({ title: '변경 사항을 저장했습니다', description: '방금 전' })}>
      토스트 띄우기
    </Button>
  );
}
