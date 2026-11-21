import { Field, Textarea } from '@hoon-ds/react';

export default function BasicExample() {
  return (
    <Field.Root style={{ width: '100%', maxWidth: 400 }}>
      <Field.Label>문의 내용</Field.Label>
      <Textarea placeholder="내용을 입력하세요" />
      <Field.Description>답변은 영업일 기준 1일 안에 메일로 드립니다.</Field.Description>
    </Field.Root>
  );
}
