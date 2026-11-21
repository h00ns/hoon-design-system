import { AlertDialog, Button } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="danger">계정 삭제</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>계정을 삭제할까요?</AlertDialog.Title>
        <AlertDialog.Description>
          주문 내역과 적립금이 모두 사라지며 복구할 수 없습니다.
        </AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>취소</AlertDialog.Cancel>
          <AlertDialog.Action variant="danger" onClick={() => console.log('계정 삭제')}>
            삭제
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
