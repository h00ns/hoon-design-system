import { Button, toast } from '@hoon-ds/react';

export default function UpdateByIdExample() {
  const upload = () => {
    // 같은 id 로 다시 호출하면 새로 띄우지 않고 내용을 바꾼다
    toast('업로드 중…', { id: 'upload', duration: Infinity });
    setTimeout(() => {
      toast.success('업로드 완료', { id: 'upload', duration: 4000 });
    }, 1500);
  };

  return <Button onClick={upload}>파일 업로드</Button>;
}
