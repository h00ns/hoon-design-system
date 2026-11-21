import { AlertDialog, Button } from '@hoon-ds/react';

export default function ConfirmExample() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="secondary">작성 취소</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>작성을 그만둘까요?</AlertDialog.Title>
        <AlertDialog.Description>지금까지 입력한 내용은 저장되지 않습니다.</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>계속 작성</AlertDialog.Cancel>
          <AlertDialog.Action>그만두기</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
