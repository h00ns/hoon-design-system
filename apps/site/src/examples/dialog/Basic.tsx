import { Button, Dialog, Field, Input } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>프로필 편집</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>프로필 편집</Dialog.Title>
          <Dialog.Description>변경한 내용은 저장을 눌러야 반영됩니다.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <div style={{ display: 'grid', gap: 16 }}>
            <Field.Root required>
              <Field.Label>이름</Field.Label>
              <Input defaultValue="홍길동" autoComplete="name" />
            </Field.Root>
            <Field.Root>
              <Field.Label>소개</Field.Label>
              <Input placeholder="한 줄 소개" />
              <Field.Description>프로필 상단에 보입니다.</Field.Description>
            </Field.Root>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="secondary">취소</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button>저장</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
